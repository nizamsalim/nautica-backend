import { Router } from "express";
import { predictSuitability } from "../controllers/predictionController";

const router = Router();

router.post("/predict", predictSuitability);

export default router;
