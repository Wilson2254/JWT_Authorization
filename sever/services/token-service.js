import jwt from "jsonwebtoken";
import TokenModel from "../models/token-model.js";

const REFRESH_TOKEN_DURATION_DAY = 14;

const refreshTokenDurationDayToMs =
  REFRESH_TOKEN_DURATION_DAY * 24 * 60 * 60 * 1000;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: `${REFRESH_TOKEN_DURATION_DAY}d`,
    });

    return {
      accessToken,
      refreshToken,
      refreshTokenDurationDayToMs,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      return userData;
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);

      return { userData, refreshTokenDurationDayToMs };
    } catch (err) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(token) {
    const tokenData = await TokenModel.deleteOne({ refreshToken: token });
    return tokenData;
  }

  async findToken(token) {
    const tokenData = await TokenModel.findOne({ refreshToken: token });
    return tokenData;
  }
}

export default new TokenService();
