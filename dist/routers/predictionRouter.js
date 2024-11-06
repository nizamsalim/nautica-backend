"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const predictionController_1 = require("../controllers/predictionController");
const router = (0, express_1.Router)();
router.get("/predict", predictionController_1.predictSuitability);
// router.get("/range",getNormalizationRanges)
exports.default = router;
