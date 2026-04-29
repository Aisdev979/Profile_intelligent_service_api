import { Router } from "express"
import {isAuthenticated, isAuthorized, verifyCSRF} from "../middlewares/auth.middlewares.js"
import {
  createProfile,
  deleteProfile,
  getAllProfiles,
  getSingleProfile,
  searchNaturalLanguage,
} from "../controllers/profiles.controllers.js";

const profilesRoute = Router();
	
profilesRoute.route("/profiles")
  .post(isAuthenticated, verifyCSRF,  isAuthorized("admin"), createProfile)
  .get(isAuthenticated, isAuthorized("admin", "analyst"), getAllProfiles);

profilesRoute
  .route("/profiles/search")
  .get(isAuthenticated, isAuthorized("admin", "analyst"), searchNaturalLanguage);

profilesRoute
  .route("/profiles/:id")
  .get(isAuthenticated, isAuthorized("admin", "analyst"), getSingleProfile)
  .delete(isAuthenticated, verifyCSRF, isAuthorized("admin"), deleteProfile);

export default profilesRoute;
