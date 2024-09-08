"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalizationRanges = exports.predictSuitability = void 0;
const API_1 = require("../constants/API");
const axios_1 = __importDefault(require("axios"));
const assignRanges_1 = __importDefault(require("../helpers/assignRanges"));
const predictSuitability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { la, lo, time } = req.body;
    const lat = parseFloat(la);
    const long = parseFloat(lo);
    const api = `${API_1.MARINE_API}q=${lat}%2C${long}&hour=${time}&days=1`;
    //   res.json({ api });
    // const data: WeatherDataResponse = {
    //   location: {
    //     name: "Chennai",
    //     region: "Tamil Nadu",
    //     country: "India",
    //     lat: 13.05,
    //     lon: 80.28,
    //     tz_id: "Asia/Kolkata",
    //     localtime_epoch: 1725729941,
    //     localtime: "2024-09-07 22:55",
    //   },
    //   forecast: {
    //     forecastday: [
    //       {
    //         date: "2024-09-07",
    //         day: {
    //           maxtemp_c: 31.2,
    //           mintemp_c: 27.7,
    //           avgtemp_c: 29.3,
    //           maxwind_kph: 11.4,
    //           totalprecip_mm: 2.22,
    //           totalsnow_cm: 0,
    //           avgvis_km: 9.8,
    //           avghumidity: 72,
    //           tides: [
    //             {
    //               tide: [
    //                 {
    //                   tide_time: "2024-09-07 04:22",
    //                   tide_height_mt: 0.3,
    //                   tide_type: "LOW",
    //                 },
    //                 {
    //                   tide_time: "2024-09-07 10:24",
    //                   tide_height_mt: 1.1,
    //                   tide_type: "HIGH",
    //                 },
    //                 {
    //                   tide_time: "2024-09-07 16:38",
    //                   tide_height_mt: 0.3,
    //                   tide_type: "LOW",
    //                 },
    //                 {
    //                   tide_time: "2024-09-07 22:52",
    //                   tide_height_mt: 1.1,
    //                   tide_type: "HIGH",
    //                 },
    //               ],
    //             },
    //           ],
    //           condition: {
    //             text: "Light rain shower",
    //             icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
    //             code: 1240,
    //           },
    //           uv: 6,
    //         },
    //         astro: {
    //           sunrise: "05:58 AM",
    //           sunset: "06:15 PM",
    //         },
    //         hour: [
    //           {
    //             time: "2024-09-07 14:00",
    //             temp_c: 31.1,
    //             is_day: 1,
    //             condition: {
    //               text: "Cloudy ",
    //               icon: "//cdn.weatherapi.com/weather/64x64/day/119.png",
    //               code: 1006,
    //             },
    //             wind_kph: 5.8,
    //             wind_degree: 11,
    //             wind_dir: "NNE",
    //             pressure_mb: 1004,
    //             precip_mm: 0,
    //             humidity: 64,
    //             cloud: 85,
    //             feelslike_c: 36.3,
    //             windchill_c: 31.1,
    //             heatindex_c: 36.3,
    //             dewpoint_c: 23.6,
    //             vis_km: 10,
    //             gust_kph: 9.4,
    //             uv: 7,
    //             sig_ht_mt: 0.9,
    //             swell_ht_mt: 0.9,
    //             swell_dir: 152,
    //             water_temp_c: 26.5,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // };
    // let hourlyForecast;
    try {
        const r = yield axios_1.default.get(api);
        const data = r.data;
        // console.log("flag");
        const location = data.location;
        const dailyForecast = data.forecast.forecastday[0].day;
        const hourlyForecast = data.forecast.forecastday[0].hour[0];
        const { sunrise, sunset } = data.forecast.forecastday[0].astro;
        const normalizationRanges = Object.values({
            cloud: { min: 0, max: 100 },
            uv: { min: 0, max: 11 },
            temp_land: { min: 20, max: 50 },
            temp_water: { min: 0, max: 40 },
            wind_speed: { min: 0, max: 30 },
            wind_degree: { min: 0, max: 360 },
            pressure: { min: 950, max: 1015 },
            humidity: { min: 0, max: 100 },
            sig_ht: { min: 0, max: 2 },
            swell_ht: { min: 0, max: 2 },
            swell_dir: { min: 0, max: 360 },
            gust_speed: { min: 0, max: 50 },
            wind_chill: { min: 20, max: 30 },
            dew_point: { min: 20, max: 30 },
            heat_index: { min: 25, max: 50 },
        });
        const normalizationRanges_ = Object.values({
            cloud: { min: 0, max: 100 },
            uv: { min: 1, max: 11 },
            temp_land: { min: 28.8, max: 29.1 },
            temp_water: { min: 28.8, max: 29.1 },
            wind_speed: { min: 5.8, max: 20.9 },
            wind_degree: { min: 0, max: 360 },
            pressure: { min: 1003, max: 1005 },
            humidity: { min: 0, max: 100 },
            sig_ht: { min: 0.4, max: 0.8 },
            swell_ht: { min: 1, max: 1.2 },
            gust_speed: { min: 9.9, max: 32.4 },
            wind_chill: { min: 28.8, max: 29.1 },
            dew_point: { min: 22.5, max: 23.7 },
            heat_index: { min: 33.1, max: 33.5 },
        });
        let calc = Object.values({
            // tides: dailyForecast.tides![0].tide,
            cloud: hourlyForecast.cloud,
            uv: hourlyForecast.uv,
            temp_land: hourlyForecast.temp_c,
            temp_water: hourlyForecast.water_temp_c,
            wind_speed: hourlyForecast.wind_kph,
            wind_degree: hourlyForecast.wind_degree,
            // wind_dir: hourlyForecast.wind_dir,
            pressure: hourlyForecast.pressure_mb,
            humidity: hourlyForecast.humidity,
            sig_ht: hourlyForecast.sig_ht_mt,
            swell_ht: hourlyForecast.swell_ht_mt,
            swell_dir: hourlyForecast.swell_dir,
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
            wind_degree: hourlyForecast.wind_degree,
            wind_dir: hourlyForecast.wind_dir,
            pressure: hourlyForecast.pressure_mb,
            humidity: hourlyForecast.humidity,
            sig_ht: hourlyForecast.sig_ht_mt,
            swell_ht: hourlyForecast.swell_ht_mt,
            swell_dir: hourlyForecast.swell_dir,
            gust_speed: hourlyForecast.gust_kph,
            wind_chill: hourlyForecast.windchill_c,
            dew_point: hourlyForecast.dewpoint_c,
            heat_index: hourlyForecast.heatindex_c,
        };
        const weights = Object.values({
            cloud: 1,
            uv: -2,
            temp_land: 2,
            temp_water: 2,
            wind_speed: -2,
            wind_degree: 1,
            pressure: 2,
            humidity: -1,
            sig_ht: -4,
            swell_ht: -2,
            swell_dir: 1,
            gust_speed: -2,
            wind_chill: -3,
            dew_point: -2,
            heat_index: -2, // Slightly reduced inverse relationship (extreme heat is uncomfortable, but some can tolerate it)
        });
        const weights_ = Object.values({
            cloud: 2,
            uv: 3,
            temp_land: 2,
            temp_water: 2,
            wind_speed: 3,
            // wind_degree:1,
            pressure: 1,
            humidity: 2,
            sig_ht: 2,
            swell_ht: 2,
            // swell_dir:1,
            gust_speed: 2,
        });
        //   res.json({ calc, weights });
        let totalWeight = 0;
        let suitability = 0;
        for (let i = 0; i < calc.length; i++) {
            let range = normalizationRanges[i];
            let weight = weights[i];
            let value = calc[i];
            let normalizedValue = (value - range.min) / (range.max - range.min);
            suitability += normalizedValue * weight;
            totalWeight += weight;
        }
        suitability /= totalWeight;
        suitability *= 2;
        suitability *= 100;
        const response = {
            display: {
                location: `${location.name}, ${location.region}, ${location.country}`,
                max_temp: dailyForecast.maxtemp_c,
                min_temp: dailyForecast.mintemp_c,
                avg_temp: dailyForecast.avgtemp_c,
                avg_humidity: dailyForecast.avghumidity,
                wind_speed: c.wind_speed,
                cloud: c.cloud,
                uv: c.uv,
                wind_degree: c.wind_degree,
                sunrise_time: sunrise,
                sunset_time: sunset,
                condition: {
                    text: hourlyForecast.condition.text,
                    code: hourlyForecast.condition.code,
                    icon: hourlyForecast.condition.icon.slice(2),
                },
            },
            suitability_percentage: Math.round(suitability),
        };
        res.json({ response });
    }
    catch (error) {
        res.json(error.response);
    }
});
exports.predictSuitability = predictSuitability;
const getNormalizationRanges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lat = 13.05;
    const long = 80.2824;
    const time = 17;
    const api = `${API_1.MARINE_API}q=${lat}%2C${long}&hour=${time}&days=7`;
    let data;
    try {
        const rs = yield axios_1.default.get(api);
        data = rs.data;
    }
    catch (error) {
        data = undefined;
        console.log(error.response);
    }
    const dailyForecasts = data.forecast.forecastday; // array of each day object
    const ranges = (0, assignRanges_1.default)(dailyForecasts);
    console.log(ranges);
});
exports.getNormalizationRanges = getNormalizationRanges;
