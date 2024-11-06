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
exports.predictSuitability = void 0;
const API_1 = require("../constants/API");
const axios_1 = __importDefault(require("axios"));
const predictSuitability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { la, lo, time } = req.query;
    const lat = parseFloat(la);
    const long = parseFloat(lo);
    const api = `${API_1.MARINE_API}q=${lat}%2C${long}&hour=${time}&days=1`;
    try {
        const r = yield axios_1.default.get(api);
        const data = r.data;
        // // console.log("flag");
        const location = data.location;
        const dailyForecast = data.forecast.forecastday[0].day;
        const hourlyForecast = data.forecast.forecastday[0].hour[0];
        const { sunrise, sunset } = data.forecast.forecastday[0].astro;
        const normalizationRanges = Object.values({
            cloud: { min: 0, max: 100 },
            uv: { min: 0, max: 11 },
            temp_land: { min: 10, max: 45 },
            temp_water: { min: 0, max: 40 },
            wind_speed: { min: 0, max: 150 },
            wind_degree: { min: 0, max: 360 },
            pressure: { min: 950, max: 1050 },
            humidity: { min: 0, max: 100 },
            sig_ht: { min: 0, max: 10 },
            swell_ht: { min: 0, max: 10 },
            swell_dir: { min: 0, max: 360 },
            gust_speed: { min: 0, max: 150 },
            wind_chill: { min: -20, max: 30 },
            dew_point: { min: -10, max: 30 },
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
            cloud: -0.15,
            uv: -0.1,
            temp_land: 0.15,
            temp_water: 0.1,
            wind_speed: 0.1,
            wind_degree: 0.05,
            pressure: 0.05,
            humidity: -0.1,
            sig_ht: 0.05,
            swell_ht: 0.05,
            swell_dir: 0.05,
            gust_speed: -0.05,
            wind_chill: -0.05,
            dew_point: -0.05,
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
            let value = calc[i];
            // let normalizedValue = Number(normalizeDataPoint(value, score).toFixed(2));
            let normalizedValue = Number(((value - range.min) / (range.max - range.min)).toFixed(2));
            let normalizedWeight = Number(((weight - weightRange.min) /
                (weightRange.max - weightRange.min)).toFixed(2));
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
    }
    catch (error) {
        // res.json(error.response);
        console.log(error);
    }
});
exports.predictSuitability = predictSuitability;
