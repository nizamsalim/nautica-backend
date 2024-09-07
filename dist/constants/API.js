"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARINE_API = exports.FORECAST_API = exports.CURRENT_API = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// const API_KEY = process.env.API_KEY;
const API_KEY = "8166c445714c46bb86865501240709";
const API_BASE_URL = "http://api.weatherapi.com/v1";
const CURRENT = "current.json";
const FORECAST = "forecast.json";
const MARINE = "marine.json";
exports.CURRENT_API = `${API_BASE_URL}/${CURRENT}?key=${API_KEY}&`;
exports.FORECAST_API = `${API_BASE_URL}/${FORECAST}?key=${API_KEY}&`;
exports.MARINE_API = `${API_BASE_URL}/${MARINE}?key=${API_KEY}&`;