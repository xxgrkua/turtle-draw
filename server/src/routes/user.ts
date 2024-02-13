import express from "express";
import { body } from "express-validator";
import { login, logout, register } from "../controllers/user";
import { validate } from "../middlewares";

const router = express.Router();

router.post(
  "/login",
  validate([body("username").notEmpty(), body("password").notEmpty()]),
  login,
);

router.post(
  "/register",
  validate([
    body("username").notEmpty(),
    body("password").notEmpty().isLength({ min: 8, max: 100 }),
  ]),
  register,
);

router.get("/logout", logout);

export default router;
