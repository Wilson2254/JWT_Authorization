import express from "express";
const RouterClass = express.Router;
import UserController from "../controllers/user-controller.js";

const router = new RouterClass();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/users", UserController.getUsers);

export default router;
