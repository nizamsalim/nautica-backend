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
const predictSuitability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { la, lo, time } = req.body;
    const lat = parseFloat(la);
    const long = parseFloat(lo);
    const api = `${API_1.MARINE_API}q=${lat}%2C${long}&hour=${time}&days=1`;
    //   res.json({ api });
    const data = {
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
    try {
        // const r = await axios.get(api);
        // // res.json({ data: r.data });
        // const data = r.data;
        console.log("flag");
        const location = data.location;
        const dailyForecast = data.forecast.forecastday[0].day;
        const hourlyForecast = data.forecast.forecastday[0].hour[0];
        const { sunrise, sunset } = data.forecast.forecastday[0].astro;
        const normalizationRanges = Object.values({
            cloud: { min: 0, max: 100 },
            uv: { min: 0, max: 11 },
            temp_land: { min: 20, max: 50 },
            temp_water: { min: 0, max: 40 },
            wind_speed: { min: 0, max: 100 },
            pressure: { min: 950, max: 1015 },
            humidity: { min: 0, max: 100 },
            sig_ht: { min: 0, max: 2 },
            swell_ht: { min: 0, max: 2 },
            gust_speed: { min: 0, max: 100 },
            wind_chill: { min: 0, max: 40 },
            dew_point: { min: 10, max: 30 },
            heat_index: { min: 25, max: 50 },
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
            uv: hourlyForecast.uv,
            temp_land: hourlyForecast.temp_c,
            temp_water: hourlyForecast.water_temp_c,
            wind_speed: hourlyForecast.wind_kph,
            // wind_degree: hourlyForecast.wind_degree,
            // wind_dir: hourlyForecast.wind_dir,
            pressure: hourlyForecast.pressure_mb,
            humidity: hourlyForecast.humidity,
            cloud: hourlyForecast.cloud,
            sig_ht: hourlyForecast.sig_ht_mt,
            swell_ht: hourlyForecast.swell_ht_mt,
            // swell_dir: hourlyForecast.swell_dir,
            gust_speed: hourlyForecast.gust_kph,
            wind_chill: hourlyForecast.windchill_c,
            dew_point: hourlyForecast.dewpoint_c,
            heat_index: hourlyForecast.heatindex_c,
        };
        const weights = Object.values({
            cloud: 2,
            uv: -3,
            temp_land: 2,
            temp_water: 2,
            wind_speed: -3,
            pressure: 1,
            humidity: -2,
            sig_ht: -3,
            swell_ht: -3,
            gust_speed: -2,
            wind_chill: -2,
            dew_point: -2,
            heat_index: -3, // Inverse relationship
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
            console.log(i + " - " + value + " - " + normalizedValue);
            // if (i == 0) {
            //   normalizedValue = 1 - normalizedValue;
            // }
            suitability += normalizedValue * weight;
            totalWeight += weight;
        }
        suitability /= totalWeight;
        // suitability *= 2;
        const response = {
            display: {
                location: `${location.name}, ${location.region}, ${location.country}`,
                max_temp: dailyForecast.maxtemp_c,
                min_temp: dailyForecast.mintemp_c,
                avg_temp: dailyForecast.avgtemp_c,
                avg_humidity: dailyForecast.avghumidity,
                sunrise_time: sunrise,
                sunset_time: sunset,
                condition: {
                    text: hourlyForecast.condition.text,
                    code: hourlyForecast.condition.code,
                },
            },
            data: c,
        };
        res.json({ suitability, response });
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
    const api = `${API_1.HISTORY_API}q=${lat}%2C${long}&hour=${time}&dt=`;
    const today = new Date();
    const promises = [];
    const n = 5;
    for (let i = 0; i < n; i++) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - i);
        // Format date to YYYY-MM-DD
        const formattedDate = pastDate.toISOString().slice(0, 10);
        console.log(formattedDate);
        getHistoryData(api, formattedDate)
            .then((his) => {
            console.log(his);
            console.log("\n--------------------\n");
        })
            .catch((err) => {
            console.log(err);
        });
        break;
        // promises.push(getHistoryData(api, formattedDate));
    }
});
exports.getNormalizationRanges = getNormalizationRanges;
const getHistoryData = (api, date) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const r = yield axios_1.default.get(`${api}${date}`);
            // res.json({ data: r.data });
            const data = r.data;
            const hourlyForecast = data.forecast.forecastday[0].hour[0];
            console.log(hourlyForecast.water_temp_c + "\n----------------api data 1-----------\n");
            resolve({
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
        }
        catch (error) {
            reject(error.response);
        }
    }));
};
