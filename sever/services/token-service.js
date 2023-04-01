import jwt from "jsonwebtoken";
import TokenModel from "../models/token-model.js";

const REFRESH_TOKEN_DURATION_DAY = 14;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: `${REFRESH_TOKEN_DURATION_DAY}d`,
    });
    const refreshTokenDurationDayToMs =
      REFRESH_TOKEN_DURATION_DAY * 24 * 60 * 60 * 1000;

    return {
      accessToken,
      refreshToken,
      refreshTokenDurationDayToMs,
    };
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
}

export default new TokenService();
