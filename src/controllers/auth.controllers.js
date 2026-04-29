import crypto from "crypto";
import AuthService from "../services/github.services.js";

/**
 * 🔹 Generate CSRF token
 */
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * 🚀 Redirect user to GitHub OAuth
 */
export const userRedirect = (req, res, next) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const url = AuthService.generateGitHubAuthUrl(state);

    return res.redirect(url);
  } catch (error) {
    next(error);
  }
};

/**
 * 🔁 GitHub OAuth Callback
 */
export const githubCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      const error = new Error("Missing code or state");
      error.statusCode = 400;
      throw error;
    }

    const storedState = req.cookies.oauth_state;

    if (!storedState || state !== storedState) {
      const error = new Error("Invalid OAuth state");
      error.statusCode = 403;
      throw error;
    }

    res.clearCookie("oauth_state");

    // 🔹 OAuth flow
    const githubAccessToken = await AuthService.getAccessToken(code);
    const githubUser = await AuthService.getGitHubUser(githubAccessToken);
    const email = await AuthService.getGitHubEmail(githubAccessToken);

    const user = await AuthService.findOrCreateUser(githubUser, email);

    // 🔐 Tokens
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    // 🔄 Save refresh token
    user.refresh_token = refreshToken;
    await user.save();

    // 🧱 CSRF
    const csrfToken = generateCSRFToken();

    // 🍪 Cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("csrf_token", csrfToken, {
      httpOnly: false, // must be readable by frontend
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "GitHub OAuth successful",
      user,
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔄 Refresh Access Token (with rotation)
 */
export const refreshTokenHandler = async (req, res, next) => {
  try {
    const user = req.user;
    const token = req.cookies.refresh_token;

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
    const newRefreshToken = AuthService.generateRefreshToken(user);

    // 🔄 Rotation
    user.refresh_token = newRefreshToken;
    await user.save();

    // 🧱 New CSRF
    const csrfToken = crypto.randomBytes(32).toString("hex");

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Token refreshed",
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🚪 Logout (important for security)
 */
export const logout = async (req, res, next) => {
  try {
    const user = req.user;

    if (user) {
      user.refresh_token = null;
      await user.save();
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("csrf_token");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
	  
