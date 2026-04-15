import { Router } from "express"
import { createProfile, deleteProfile, getAllProfiles, getSingleProfile } from "../controllers/genderPrediction.controllers.js"

const genderPredictionRoute = Router();

genderPredictionRoute.post("/api/profiles", createProfile)
genderPredictionRoute.get("/api/profiles", getAllProfiles)
genderPredictionRoute.get("/api/profiles/:id", getSingleProfile)
genderPredictionRoute.delete("/api/profiles/:id", deleteProfile)

export default genderPredictionRoute;
