import { Router } from "express"
import getPredictedGender from "../controllers/genderPrediction.controllers.js"

const genderPredictionRoute = Router();

genderPredictionRoute.get("/api/classify", getPredictedGender)

export default genderPredictionRoute;
