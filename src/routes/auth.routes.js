import express from "express";
import {
	  isAuthenticated,
	  verifyRefreshToken,
	  verifyCSRF,
} from "../middlewares/auth.middlewares.js";

import {
	  userRedirect,
	  githubCallback,
	  refreshTokenHandler,
	  logout,
} from "../controllers/auth.controllers.js";

const authRoute = express.Router();

authRoute.get("/github", userRedirect);
authRoute.get("/github/callback", githubCallback);

authRoute.post("/refresh", verifyRefreshToken, refreshTokenHandler);

authRoute.post("/logout", isAuthenticated, verifyCSRF, logout);


export default authRoute
