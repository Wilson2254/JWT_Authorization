import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import userService from "../services/user-service.js";

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.badRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: userData.refreshTokenDurationDayToMs,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: userData.refreshTokenDurationDayToMs,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activateLink(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(["TEST"]);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
