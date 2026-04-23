import { Router } from "express"
import {
    createProfile,
    deleteProfile,
    getAllProfiles,
    getSingleProfile,
    searchNaturalLanguage
} from "../controllers/genderPrediction.controllers.js"

const genderPredictionRoute = Router();

genderPredictionRoute.route("/profiles")
  .post(createProfile)
  .get(getAllProfiles);

genderPredictionRoute.route("/profiles/search")
  .get(searchNaturalLanguage);

genderPredictionRoute.route("/profiles/:id")
  .get(getSingleProfile)
  .delete(deleteProfile);

export default genderPredictionRoute;
