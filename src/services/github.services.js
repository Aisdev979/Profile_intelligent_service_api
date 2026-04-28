import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

class AuthService {
  // 🔹 Generate GitHub OAuth URL
  static generateGitHubAuthUrl(state) {
    return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}&scope=user:email`;
  }

  // 🔹 Exchange code for access token
  static async getAccessToken(code) {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    return response.data.access_token;
  }

  // 🔹 Fetch GitHub user
  static async getGitHubUser(accessToken) {
    const { data } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  }

  // 🔹 Fetch GitHub email
  static async getGitHubEmail(accessToken) {
    const { data } = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data.find((email) => email.primary)?.email;
  }

  // 🔹 Find or create user
  static async findOrCreateUser(githubUser, email) {
    let user = await User.findOne({ github_id: githubUser.id });

    if (user) {
      user.last_login_at = new Date();
      await user.save();
      return user;
    }

    user = await User.create({
      github_id: githubUser.id,
      username: githubUser.login,
      email,
      avatar_url: githubUser.avatar_url,
      last_login_at: new Date(),
    });

    return user;
  }

  // 🔹 Generate Access Token
  static generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
  }

  // 🔹 Generate Refresh Token
  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
  }
}

export default AuthService;
