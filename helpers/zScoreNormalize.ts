import axios from "axios";
import { MARINE_API } from "../constants/API";
import {
  ForecastDay,
  WeatherDataResponse,
} from "../constants/WeatherResponseInterface";

export const getZScoreData = async (
  lat: number,
  long: number,
  time: number
) => {
  const api = `${MARINE_API}q=${lat}%2C${long}&hour=${time}&days=7`;

  let data: WeatherDataResponse | undefined;
  try {
    const rs = await axios.get(api);
    data = rs.data;
  } catch (error: any) {
    data = undefined;
    // console.log(error.response);
  }

  const dailyForecasts = data!.forecast.forecastday; // array of each day object

  const z_score = findMeanAndSd(dailyForecasts);
  return z_score;
};

export const normalizeDataPoint = (
  value: number,
  score: { mean: number; sd: number }
) => {
  return score.sd !== 0 ? (value - score.mean) / score.sd : 0;
};

function findMeanAndSd(dailyForecasts: ForecastDay[]) {
  type _ForecastData = {
    cloud: number[];
    uv: number[];
    temp_land: number[];
    temp_water: number[];
    wind_speed: number[];
    pressure: number[];
    humidity: number[];
    sig_ht: number[];
    swell_ht: number[];
    gust_speed: number[];
    wind_chill: number[];
    dew_point: number[];
    heat_index: number[];
  };
  let data: _ForecastData = {
    cloud: [],
    uv: [],
    temp_land: [],
    temp_water: [],
    wind_speed: [],
    pressure: [],
    humidity: [],
    sig_ht: [],
    swell_ht: [],
    gust_speed: [],
    wind_chill: [],
    dew_point: [],
    heat_index: [],
  };
  for (let i = 0; i < dailyForecasts.length; i++) {
    const hour = dailyForecasts[i].hour[0];
    data.cloud.push(hour.cloud);
    data.uv.push(hour.uv);
    data.temp_land.push(hour.temp_c);
    data.temp_water.push(hour.water_temp_c as number);
    data.wind_speed.push(hour.wind_kph);
    data.pressure.push(hour.pressure_mb);
    data.humidity.push(hour.humidity);
    data.sig_ht.push(hour.sig_ht_mt as number);
    data.swell_ht.push(hour.swell_ht_mt as number);
    data.gust_speed.push(hour.gust_kph);
    data.wind_chill.push(hour.windchill_c);
    data.dew_point.push(hour.dewpoint_c);
    data.heat_index.push(hour.heatindex_c);
  }
  let z_scores = {
    cloud: { mean: 0, sd: 0 },
    uv: { mean: 0, sd: 0 },
    temp_land: { mean: 0, sd: 0 },
    temp_water: { mean: 0, sd: 0 },
    wind_speed: { mean: 0, sd: 0 },
    pressure: { mean: 0, sd: 0 },
    humidity: { mean: 0, sd: 0 },
    sig_ht: { mean: 0, sd: 0 },
    swell_ht: { mean: 0, sd: 0 },
    gust_speed: { mean: 0, sd: 0 },
    wind_chill: { mean: 0, sd: 0 },
    dew_point: { mean: 0, sd: 0 },
    heat_index: { mean: 0, sd: 0 },
  };
  Object.entries(data).forEach(([attr, attr_values]) => {
    const mean_value = mean(attr_values);
    z_scores[attr as keyof typeof data].mean = Number(mean_value.toFixed(2));
    const sd_value = std(attr_values, mean_value);
    z_scores[attr as keyof typeof data].sd = Number(sd_value.toFixed(2));
  });
  return z_scores;

  //   z = (num - mean)/sd
}

const mean = (data: number[]) => {
  return data.reduce((cs, ele) => cs + ele, 0) / data.length;
};

const std = (data: number[], mean: number) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Math.pow(data[i] - mean, 2);
  }
  sum /= data.length;
  return Math.sqrt(sum);
};
