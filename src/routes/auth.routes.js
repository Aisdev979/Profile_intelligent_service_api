import { Router } from "express";

import { githubCallback, userRedirect } from "../controllers/auth.controllers.js";

const authRoute = Router();

authRoute.get("/github", userRedirect);
authRoute.get("/github/callback", githubCallback);

export default authRoute;
