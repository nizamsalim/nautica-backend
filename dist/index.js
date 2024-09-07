"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const predictionRouter_1 = __importDefault(require("./routers/predictionRouter"));
const _healthCheck = (req, res) => {
    return res.json({
        success: true,
        statusCode: 200,
        message: "OK: Server Running",
    });
};
const app = (0, express_1.default)();
const PORT = 5000;
(0, dotenv_1.config)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", _healthCheck);
app.use("/api", predictionRouter_1.default);
app.listen(PORT, () => {
    console.log(`server on ${PORT}`);
});
