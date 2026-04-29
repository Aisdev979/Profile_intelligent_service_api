import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * 🔐 Authenticate user via access token (cookie)
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      const error = new Error("Unauthorized, no token provided");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("Unauthorized, user not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

/**
 * 🔄 Verify refresh token
 */
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      const error = new Error("Refresh token missing");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refresh_token !== token) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 403;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 🛡️ Role-based authorization
 */
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        const error = new Error(
          "Unauthorized, you do not have permission to access this route"
        );
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * 🧱 CSRF Protection (Double Submit Cookie)
 */
export const verifyCSRF = (req, res, next) => {
  try {
    const csrfCookie = req.cookies.csrf_token;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      const error = new Error("Invalid CSRF token");
      error.statusCode = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};
