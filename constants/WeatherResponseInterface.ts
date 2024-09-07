export interface WeatherDataResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avghumidity: number;
    tides?: Tide[]; // Optional tides array
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: Hour[];
}

export interface Tide {
  tide: TideData[];
}

export interface TideData {
  tide_time: string;
  tide_height_mt: number;
  tide_type: string;
}

export interface Hour {
  time: string;
  temp_c: number;
  is_day: number; // 0 for night, 1 for day
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  windchill_c: number;
  heatindex_c: number;
  dewpoint_c: number;
  vis_km: number;
  gust_kph: number;
  uv: number;
  sig_ht_mt?: number; // Optional significant wave height
  swell_ht_mt?: number; // Optional swell height
  swell_dir?: number; // Optional swell direction
  water_temp_c?: number; // Optional water temperature
}
