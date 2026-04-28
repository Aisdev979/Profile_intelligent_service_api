import { Router } from "express"
import {
    createProfile,
    deleteProfile,
    getAllProfiles,
    getSingleProfile,
    searchNaturalLanguage
} from "../controllers/profiles.controllers.js"

const profilesRoute = Router();

profilesRoute.route("/profiles")
  .post(createProfile)
  .get(getAllProfiles);

profilesRoute.route("/profiles/search")
  .get(searchNaturalLanguage);

profilesRoute.route("/profiles/:id")
  .get(getSingleProfile)
  .delete(deleteProfile);

export default profilesRoute;
