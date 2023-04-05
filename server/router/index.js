import express from "express";
const RouterClass = express.Router;
import UserController from "../controllers/user-controller.js";
const router = new RouterClass();
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware.js";

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  UserController.registration
);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/users", authMiddleware, UserController.getUsers);

export default router;
