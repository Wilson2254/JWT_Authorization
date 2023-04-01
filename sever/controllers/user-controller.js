import UserService from "../services/user-service.js";

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: userData.refreshTokenDurationDayToMs,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (err) {
      console.log(err);
    }
  }

  async login(req, res, next) {
    try {
    } catch {}
  }

  async logout(req, res, next) {
    try {
    } catch {}
  }

  async activate(req, res, next) {
    try {
    } catch {}
  }

  async refresh(req, res, next) {
    try {
    } catch {}
  }

  async getUsers(req, res, next) {
    try {
      res.json(["TEST"]);
    } catch {}
  }
}

export default new UserController();
