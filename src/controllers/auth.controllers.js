import crypto from "crypto";
import AuthService from "../services/github.services.js";
import User from "../models/user.model.js";

export const userRedirect = (req, res, next) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: true, // true in production
      sameSite: "lax",
    });

    const url = AuthService.generateGitHubAuthUrl(state);

    return res.redirect(url); // ✅ RETURN
  } catch (error) {
    next(error);
  }
};

export const githubCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
        const error = new Error("Missing code or state in callback");
        error.statusCode = 400;
        throw error;
    }

    const storedState = req.cookies.oauth_state;

    if (!storedState || state !== storedState) {
        const error = new Error("Invalid OAuth state");
        error.statusCode = 403;
        throw error;
    }

    // ✅ clear AFTER validation
    res.clearCookie("oauth_state");

    // 🔹 OAuth flow
    const githubAccessToken = await AuthService.getAccessToken(code);

    if (!githubAccessToken) {
      return res.status(400).json({
        message: "Failed to retrieve access token",
      });
    }

    const githubUser = await AuthService.getGitHubUser(githubAccessToken);
    const email = await AuthService.getGitHubEmail(githubAccessToken);

    const user = await AuthService.findOrCreateUser(githubUser, email);

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true, // true in production
      sameSite: "lax",
      maxAge: 3 * 60 * 1000, // 3 min
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    

    return res.status(200).json({
      message: "GitHub OAuth successful",
      user,
      token: accessToken, // ✅ your JWT only
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      const error = new Error("No refresh token");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.refresh_token !== token) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 403;
        throw error;
    }

    const newAccessToken = AuthService.generateAccessToken(user);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3 * 60 * 1000, // 3 min
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    next(error);
  }
};
