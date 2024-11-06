import { config } from "dotenv";
config();

// const API_KEY = process.env.API_KEY;
const API_KEY_ = "8166c445714c46bb86865501240709";

const API_KEY = "3866d9d8ae0a48e5982163551240611";

const API_BASE_URL = "http://api.weatherapi.com/v1";

const CURRENT = "current.json";

const FORECAST = "forecast.json";

const MARINE = "marine.json";

const HISTORY = "history.json";

export const CURRENT_API = `${API_BASE_URL}/${CURRENT}?key=${API_KEY}&`;

export const FORECAST_API = `${API_BASE_URL}/${FORECAST}?key=${API_KEY}&`;

export const MARINE_API = `${API_BASE_URL}/${MARINE}?key=${API_KEY}&`;

export const HISTORY_API = `${API_BASE_URL}/${HISTORY}?key=${API_KEY}&`;
