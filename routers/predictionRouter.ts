import { Router } from "express";
import { getNormalizationRanges, predictSuitability } from "../controllers/predictionController";

const router = Router();

router.post("/predict", predictSuitability);

router.get("/range",getNormalizationRanges)

export default router;
