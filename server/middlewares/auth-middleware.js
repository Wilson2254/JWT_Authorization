import ApiError from "../exceptions/api-error.js";
import tokenService from "../services/token-service.js";

export default function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unauthorizedError());
    }
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return next(ApiError.unauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.unauthorizedError());
    }

    req.user = userData;
    next();
  } catch (err) {
    return next(ApiError.unauthorizedError());
  }
}
