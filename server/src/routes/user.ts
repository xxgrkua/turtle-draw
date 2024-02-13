import express from "express";
import { body } from "express-validator";

import {
  deleteUserFile,
  editUserFile,
  getUserFile,
  publishFile,
  unpublishFile,
} from "../controllers/file";
import {
  deleteUser,
  getUser,
  login,
  logout,
  modifyUser,
  register,
} from "../controllers/user";
import { authenticateUsername, validate } from "../middlewares";

const router = express.Router();

router.get("/:username", getUser);

router.put(
  "/:username",
  authenticateUsername,
  validate([body("password").optional().isLength({ min: 8, max: 100 })]),
  modifyUser,
);

router.delete("/:username", authenticateUsername, deleteUser);

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

router.get("/:username/file/:fileId", authenticateUsername, getUserFile);

router.put(
  "/:username/file/:fileId",
  authenticateUsername,
  validate([body("content").notEmpty(), body("graphic").notEmpty()]),
  editUserFile,
);

router.delete("/:username/file/:fileId", authenticateUsername, deleteUserFile);

router.post(
  "/:username/file/:fileId/publish",
  authenticateUsername,
  publishFile,
);

router.delete(
  "/:username/file/:fileId/publish",
  authenticateUsername,
  unpublishFile,
);

export default router;
