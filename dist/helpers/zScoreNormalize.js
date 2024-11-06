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
exports.normalizeDataPoint = exports.getZScoreData = void 0;
const axios_1 = __importDefault(require("axios"));
const API_1 = require("../constants/API");
const getZScoreData = (lat, long, time) => __awaiter(void 0, void 0, void 0, function* () {
    const api = `${API_1.MARINE_API}q=${lat}%2C${long}&hour=${time}&days=7`;
    let data;
    try {
        const rs = yield axios_1.default.get(api);
        data = rs.data;
    }
    catch (error) {
        data = undefined;
        // console.log(error.response);
    }
    const dailyForecasts = data.forecast.forecastday; // array of each day object
    const z_score = findMeanAndSd(dailyForecasts);
    return z_score;
});
exports.getZScoreData = getZScoreData;
const normalizeDataPoint = (value, score) => {
    return score.sd !== 0 ? (value - score.mean) / score.sd : 0;
};
exports.normalizeDataPoint = normalizeDataPoint;
function findMeanAndSd(dailyForecasts) {
    let data = {
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
        data.temp_water.push(hour.water_temp_c);
        data.wind_speed.push(hour.wind_kph);
        data.pressure.push(hour.pressure_mb);
        data.humidity.push(hour.humidity);
        data.sig_ht.push(hour.sig_ht_mt);
        data.swell_ht.push(hour.swell_ht_mt);
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
        z_scores[attr].mean = Number(mean_value.toFixed(2));
        const sd_value = std(attr_values, mean_value);
        z_scores[attr].sd = Number(sd_value.toFixed(2));
    });
    return z_scores;
    //   z = (num - mean)/sd
}
const mean = (data) => {
    return data.reduce((cs, ele) => cs + ele, 0) / data.length;
};
const std = (data, mean) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += Math.pow(data[i] - mean, 2);
    }
    sum /= data.length;
    return Math.sqrt(sum);
};
