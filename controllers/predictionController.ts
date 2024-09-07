import { Request, Response } from "express";
import { MARINE_API } from "../constants/API";
import axios, { AxiosRequestConfig } from "axios";
import { WeatherDataResponse } from "../constants/WeatherResponseInterface";

export const predictSuitability = async (req: Request, res: Response) => {
  let { la, lo, time } = req.body;
  const lat = parseFloat(la as string);
  const long = parseFloat(lo as string);
  const api = `${MARINE_API}q=${lat}%2C${long}&hour=${time}&days=1`;
  //   res.json({ api });

  const data: WeatherDataResponse = {
    location: {
      name: "Chennai",
      region: "Tamil Nadu",
      country: "India",
      lat: 13.05,
      lon: 80.28,
      tz_id: "Asia/Kolkata",
      localtime_epoch: 1725729941,
      localtime: "2024-09-07 22:55",
    },
    forecast: {
      forecastday: [
        {
          date: "2024-09-07",
          day: {
            maxtemp_c: 31.2,
            mintemp_c: 27.7,
            avgtemp_c: 29.3,
            maxwind_kph: 11.4,
            totalprecip_mm: 2.22,
            totalsnow_cm: 0,
            avgvis_km: 9.8,
            avghumidity: 72,
            tides: [
              {
                tide: [
                  {
                    tide_time: "2024-09-07 04:22",
                    tide_height_mt: 0.3,
                    tide_type: "LOW",
                  },
                  {
                    tide_time: "2024-09-07 10:24",
                    tide_height_mt: 1.1,
                    tide_type: "HIGH",
                  },
                  {
                    tide_time: "2024-09-07 16:38",
                    tide_height_mt: 0.3,
                    tide_type: "LOW",
                  },
                  {
                    tide_time: "2024-09-07 22:52",
                    tide_height_mt: 1.1,
                    tide_type: "HIGH",
                  },
                ],
              },
            ],
            condition: {
              text: "Light rain shower",
              icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
              code: 1240,
            },
            uv: 6,
          },
          astro: {
            sunrise: "05:58 AM",
            sunset: "06:15 PM",
          },
          hour: [
            {
              time: "2024-09-07 14:00",
              temp_c: 31.1,
              is_day: 1,
              condition: {
                text: "Cloudy ",
                icon: "//cdn.weatherapi.com/weather/64x64/day/119.png",
                code: 1006,
              },
              wind_kph: 5.8,
              wind_degree: 11,
              wind_dir: "NNE",
              pressure_mb: 1004,
              precip_mm: 0,
              humidity: 64,
              cloud: 85,
              feelslike_c: 36.3,
              windchill_c: 31.1,
              heatindex_c: 36.3,
              dewpoint_c: 23.6,
              vis_km: 10,
              gust_kph: 9.4,
              uv: 7,
              sig_ht_mt: 0.9,
              swell_ht_mt: 0.9,
              swell_dir: 152,
              water_temp_c: 26.5,
            },
          ],
        },
      ],
    },
  };

  const location = data.location;
  const dailyForecast = data.forecast.forecastday[0].day;
  const hourlyForecast = data.forecast.forecastday[0].hour[0];
  const { sunrise, sunset } = data.forecast.forecastday[0].astro;

  let calc = Object.values({
    // tides: dailyForecast.tides![0].tide,
    uv: hourlyForecast.uv,
    temp_land: hourlyForecast.temp_c,
    temp_water: hourlyForecast.water_temp_c,
    wind_speed: hourlyForecast.wind_kph,
    wind_degree: hourlyForecast.wind_degree,
    // wind_dir: hourlyForecast.wind_dir,
    pressure: hourlyForecast.pressure_mb/1000,
    humidity: hourlyForecast.humidity,
    cloud: hourlyForecast.cloud,
    sig_ht: hourlyForecast.sig_ht_mt,
    swell_ht: hourlyForecast.swell_ht_mt,
    swell_dir: hourlyForecast.swell_dir,
    gust_speed: hourlyForecast.gust_kph,
  });

  const weights = Object.values({
    uv: 3,
    temp_land: 2,
    temp_water: 2,
    wind_speed: 3,
    wind_degree: 1,
    pressure: 1,
    humidity: 2,
    cloud: 2,
    sig_ht: 3,
    swell_ht: 3,
    swell_dir: 1,
    gust_speed: 2,
  });
  //   res.json({ calc, weights });
  let totalWeight = 0;

  let suitability = 0;
  for (let i = 0; i < calc.length; i++) {
    suitability += (calc[i] as number) * weights[i];
    totalWeight += weights[i]
  }
  suitability /= totalWeight;
  res.json({ suitability });

  // for(var key in calc){
  //   suitability += calc[key] * weights[key];
  // }

  const response = {
    display: {
      location: `${data.location.name}, ${data.location.region}, ${data.location.country}`,
      max_temp: dailyForecast.maxtemp_c,
      min_temp: dailyForecast.mintemp_c,
      avg_temp: dailyForecast.avgtemp_c,
      avg_humidity: dailyForecast.avghumidity,
      sunrise_time: sunrise,
      sunset_time: sunset,
      condition: {
        text: hourlyForecast.condition.text,
        icon: hourlyForecast.condition.icon.slice(2),
      },
    },
  };

  //   axios
  //     .get(api)
  //     .then((rs) => {
  //       res.json(rs.data);
  //     })
  //     .catch((c: any) => {
  //       res.json(c.response);
  //     });

  //   try {
  //     const r = await axios.get(api);
  //     res.json({ data: r.data });
  //   } catch (error: any) {
  //     res.json(error.response);
  //   }
};
