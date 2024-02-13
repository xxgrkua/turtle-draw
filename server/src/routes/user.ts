import express from "express";
import { body } from "express-validator";
import { del, edit, get, login, logout, register } from "../controllers/user";
import { authenticateUsername, validate } from "../middlewares";

const router = express.Router();

router.get("/:username", get);

router.put(
  "/:username",
  authenticateUsername,
  validate([body("password").optional().isLength({ min: 8, max: 100 })]),
  edit,
);

router.delete("/:username", authenticateUsername, del);

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
