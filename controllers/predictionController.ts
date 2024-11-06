import { Request, Response } from "express";
import { MARINE_API, HISTORY_API } from "../constants/API";
import axios from "axios";
import {
  ForecastDay,
  ForecastMarineData,
  WeatherDataResponse,
} from "../constants/WeatherResponseInterface";
import { getZScoreData, normalizeDataPoint } from "../helpers/zScoreNormalize";

export const predictSuitability = async (req: Request, res: Response) => {
  let { la, lo, time } = req.query;
  const lat = parseFloat(la as string);
  const long = parseFloat(lo as string);
  const api = `${MARINE_API}q=${lat}%2C${long}&hour=${time}&days=1`;

  try {
    const r = await axios.get(api);
    const data: WeatherDataResponse = r.data;
    // // console.log("flag");

    const location = data.location;
    const dailyForecast = data.forecast.forecastday[0].day;
    const hourlyForecast = data.forecast.forecastday[0].hour[0];
    const { sunrise, sunset } = data.forecast.forecastday[0].astro;

    const normalizationRanges = Object.values({
      cloud: { min: 0, max: 100 }, // Cloud cover percentage: 0% to 100%
      uv: { min: 0, max: 11 }, // UV index range: 0 (low) to 11+ (extreme)
      temp_land: { min: 10, max: 45 }, // Reasonable land temp range in Celsius (expanded to 45°C for hotter regions)
      temp_water: { min: 0, max: 40 }, // Reasonable water temp range in Celsius (typical range for seas and oceans)
      wind_speed: { min: 0, max: 150 }, // Wind speed in kph: typical range for storms and weather events (expanded to 150 kph)
      wind_degree: { min: 0, max: 360 }, // Wind direction: 0° to 360°
      pressure: { min: 950, max: 1050 }, // Atmospheric pressure in hPa (from 950 hPa to 1050 hPa for extreme weather conditions)
      humidity: { min: 0, max: 100 }, // Humidity percentage: 0% to 100%
      sig_ht: { min: 0, max: 10 }, // Significant wave height in meters: expanded to 10m (reasonable for high seas)
      swell_ht: { min: 0, max: 10 }, // Swell wave height in meters: similar to significant wave height
      swell_dir: { min: 0, max: 360 }, // Swell direction: 0° to 360°
      gust_speed: { min: 0, max: 150 }, // Gust speed in kph: matching max wind speed
      wind_chill: { min: -20, max: 30 }, // Wind chill temperature: added -20°C for cold conditions
      dew_point: { min: -10, max: 30 }, // Dew point: -10°C to 30°C (covers most realistic conditions)
      heat_index: { min: 25, max: 55 }, // Heat index: 25°C to 55°C (expanded upper range for extreme heat)
    });

    let calc = Object.values({
      // tides: dailyForecast.tides![0].tide,
      cloud: hourlyForecast.cloud,
      uv: hourlyForecast.uv,
      temp_land: hourlyForecast.temp_c,
      temp_water: hourlyForecast.water_temp_c,
      wind_speed: hourlyForecast.wind_kph,
      // wind_degree: hourlyForecast.wind_degree,
      // wind_dir: hourlyForecast.wind_dir,
      pressure: hourlyForecast.pressure_mb,
      humidity: hourlyForecast.humidity,
      sig_ht: hourlyForecast.sig_ht_mt,
      swell_ht: hourlyForecast.swell_ht_mt,
      // swell_dir: hourlyForecast.swell_dir,
      gust_speed: hourlyForecast.gust_kph,
      wind_chill: hourlyForecast.windchill_c,
      dew_point: hourlyForecast.dewpoint_c,
      heat_index: hourlyForecast.heatindex_c,
    });
    const c = {
      // tides: dailyForecast.tides![0].tide,
      cloud: hourlyForecast.cloud,
      uv: hourlyForecast.uv,
      temp_land: hourlyForecast.temp_c,
      temp_water: hourlyForecast.water_temp_c,
      wind_speed: hourlyForecast.wind_kph,
      // wind_degree: hourlyForecast.wind_degree,
      // wind_dir: hourlyForecast.wind_dir,
      pressure: hourlyForecast.pressure_mb,
      humidity: hourlyForecast.humidity,
      sig_ht: hourlyForecast.sig_ht_mt,
      swell_ht: hourlyForecast.swell_ht_mt,
      // swell_dir: hourlyForecast.swell_dir,
      gust_speed: hourlyForecast.gust_kph,
      wind_chill: hourlyForecast.windchill_c,
      dew_point: hourlyForecast.dewpoint_c,
      heat_index: hourlyForecast.heatindex_c,
    };
    // res.json(c);

    const weights = Object.values({
      cloud: -0.15, // Higher cloud cover generally reduces suitability
      uv: -0.1, // Higher UV levels generally reduce suitability
      temp_land: 0.15, // Moderate temperatures are generally ideal
      temp_water: 0.1, // Moderate temperatures are generally ideal
      wind_speed: 0.1, // Moderate wind can enhance certain activities
      wind_degree: 0.05, // Wind direction has less impact
      pressure: 0.05, // Pressure changes have less impact
      humidity: -0.1, // Higher humidity generally reduces suitability
      sig_ht: 0.05, // Higher waves can be exciting for some activities
      swell_ht: 0.05, // Higher waves can be exciting for some activities
      swell_dir: 0.05, // Wave direction has less impact
      gust_speed: -0.05, // Higher gusts can be uncomfortable
      wind_chill: -0.05, // Lower wind chill can reduce suitability
      dew_point: -0.05, // Higher dew point can increase humidity
      heat_index: -0.05, // Higher heat index can reduce suitability
    });
    const weights_ = Object.values({
      cloud: 2,
      uv: -5,
      temp_land: 3,
      temp_water: 4,
      wind_speed: -7,
      pressure: 1,
      humidity: -4,
      sig_ht: -9,
      swell_ht: -6,
      gust_speed: -8,
      wind_chill: -1,
      dew_point: -2,
      heat_index: -3,
    });
    // -9 to 3

    const weightRange = {
      min: -9,
      max: 3,
    };

    let totalWeight = 0;
    let suitability = 0;
    for (let i = 0; i < calc.length; i++) {
      let weight = weights_[i];
      let range = normalizationRanges[i];
      let value = calc[i] as number;
      // let normalizedValue = Number(normalizeDataPoint(value, score).toFixed(2));
      let normalizedValue = Number(
        ((value - range.min) / (range.max - range.min)).toFixed(2)
      );
      let normalizedWeight = Number(
        (
          (weight - weightRange.min) /
          (weightRange.max - weightRange.min)
        ).toFixed(2)
      );

      suitability += normalizedValue * weight;
      totalWeight += weight;
      // console.log({
      //   key: Object.keys(c)[i],
      //   normalizedValue,
      //   normalizedWeight,
      //   suitability,
      // });
    }

    suitability /= totalWeight;
    // suitability *= Math.sqrt(2);
    suitability *= 100;
    suitability = Math.round(Math.abs(suitability));
    const response = {
      display: {
        location: `${location.name}, ${location.region}, ${location.country}`,
        temp: c.temp_land,
        avg_humidity: dailyForecast.avghumidity,
        wind_speed: c.wind_speed,
        cloud: c.cloud,
        uv: c.uv,
        swell_wave_height: c.swell_ht,
        sig_wave_height: c.sig_ht,
        // wind_degree: c.wind_degree,
        sunrise_time: sunrise,
        sunset_time: sunset,
        condition: {
          text: hourlyForecast.condition.text,
          code: hourlyForecast.condition.code,
          icon: hourlyForecast.condition.icon.slice(2),
        },
      },
      suitability_percentage: suitability,
    };
    res.json({ response });
  } catch (error: any) {
    // res.json(error.response);
    console.log(error);
  }
};
