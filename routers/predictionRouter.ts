import { Router } from "express";
import { predictSuitability } from "../controllers/predictionController";

const router = Router();

router.get("/predict", predictSuitability);

// router.get("/range",getNormalizationRanges)

export default router;
