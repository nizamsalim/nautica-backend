"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assignRanges(dailyForecasts) {
    let ranges = {
        cloud: { min: Infinity, max: -Infinity },
        uv: { min: Infinity, max: -Infinity },
        temp_land: { min: Infinity, max: -Infinity },
        temp_water: { min: Infinity, max: -Infinity },
        wind_speed: { min: Infinity, max: -Infinity },
        pressure: { min: Infinity, max: -Infinity },
        humidity: { min: Infinity, max: -Infinity },
        sig_ht: { min: Infinity, max: -Infinity },
        swell_ht: { min: Infinity, max: -Infinity },
        gust_speed: { min: Infinity, max: -Infinity },
        wind_chill: { min: Infinity, max: -Infinity },
        dew_point: { min: Infinity, max: -Infinity },
        heat_index: { min: Infinity, max: -Infinity },
    };
    for (let i = 0; i < dailyForecasts.length; i++) {
        const hour = dailyForecasts[i].hour[0];
        if (hour.cloud < ranges.cloud.min) {
            ranges.cloud.min = hour.cloud;
        }
        else if (hour.cloud > ranges.cloud.min) {
            ranges.cloud.max = hour.cloud;
        }
        if (hour.uv < ranges.uv.min) {
            ranges.uv.min = hour.uv;
        }
        else if (hour.uv > ranges.uv.min) {
            ranges.uv.max = hour.uv;
        }
        if (hour.temp_c < ranges.temp_land.min) {
            ranges.temp_land.min = hour.temp_c;
        }
        else if (hour.temp_c > ranges.temp_land.min) {
            ranges.temp_land.max = hour.temp_c;
        }
        if (hour.temp_c < ranges.temp_water.min) {
            ranges.temp_water.min = hour.temp_c;
        }
        else if (hour.temp_c > ranges.temp_water.min) {
            ranges.temp_water.max = hour.temp_c;
        }
        if (hour.wind_kph < ranges.wind_speed.min) {
            ranges.wind_speed.min = hour.wind_kph;
        }
        else if (hour.wind_kph > ranges.wind_speed.min) {
            ranges.wind_speed.max = hour.wind_kph;
        }
        if (hour.pressure_mb < ranges.pressure.min) {
            ranges.pressure.min = hour.pressure_mb;
        }
        else if (hour.pressure_mb > ranges.pressure.min) {
            ranges.pressure.max = hour.pressure_mb;
        }
        if (hour.humidity < ranges.humidity.min) {
            ranges.humidity.min = hour.humidity;
        }
        else if (hour.humidity > ranges.humidity.min) {
            ranges.humidity.max = hour.humidity;
        }
        if (hour.sig_ht_mt < ranges.sig_ht.min) {
            ranges.sig_ht.min = hour.sig_ht_mt;
        }
        else if (hour.sig_ht_mt > ranges.sig_ht.min) {
            ranges.sig_ht.max = hour.sig_ht_mt;
        }
        if (hour.swell_ht_mt < ranges.swell_ht.min) {
            ranges.swell_ht.min = hour.swell_ht_mt;
        }
        else if (hour.swell_ht_mt > ranges.swell_ht.min) {
            ranges.swell_ht.max = hour.swell_ht_mt;
        }
        if (hour.gust_kph < ranges.gust_speed.min) {
            ranges.gust_speed.min = hour.gust_kph;
        }
        else if (hour.gust_kph > ranges.gust_speed.min) {
            ranges.gust_speed.max = hour.gust_kph;
        }
        if (hour.windchill_c < ranges.wind_chill.min) {
            ranges.wind_chill.min = hour.windchill_c;
        }
        else if (hour.windchill_c > ranges.wind_chill.min) {
            ranges.wind_chill.max = hour.windchill_c;
        }
        if (hour.dewpoint_c < ranges.dew_point.min) {
            ranges.dew_point.min = hour.dewpoint_c;
        }
        else if (hour.dewpoint_c > ranges.dew_point.min) {
            ranges.dew_point.max = hour.dewpoint_c;
        }
        if (hour.heatindex_c < ranges.heat_index.min) {
            ranges.heat_index.min = hour.heatindex_c;
        }
        else if (hour.heatindex_c > ranges.heat_index.min) {
            ranges.heat_index.max = hour.heatindex_c;
        }
    }
    return ranges;
}
exports.default = assignRanges;
