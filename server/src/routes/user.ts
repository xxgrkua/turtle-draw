import express from "express";
import { body } from "express-validator";

import {
  closeFile,
  createFile,
  deleteFile,
  getFile,
  modifyFile,
  publishFile,
  unpublishFile,
} from "../controllers/file";
import {
  deleteUser,
  getMe,
  getUser,
  login,
  logout,
  modifyUser,
  register,
} from "../controllers/user";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  modifyWorkspace,
} from "../controllers/workspaces";
import {
  authenticateSession,
  authenticateUsername,
  validate,
} from "../middlewares";

const router = express.Router();

router.get("/", authenticateSession, getMe);

router.get("/:username", getUser);

router.put(
  "/:username",
  authenticateUsername,
  validate([
    body("password")
      .optional()
      .isString()
      .withMessage("password is not a string")
      .bail()
      .isLength({ min: 8, max: 100 })
      .withMessage("password is not between 8 and 100 characters")
      .bail(),
  ]),
  modifyUser,
);

router.delete("/:username", authenticateUsername, deleteUser);

router.post(
  "/login",
  validate([
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .bail()
      .isString()
      .withMessage("username is not a string")
      .bail(),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .bail()
      .isString()
      .withMessage("password is not a string")
      .bail()
      .isLength({ min: 8, max: 100 })
      .withMessage("password is not between 8 and 100 characters")
      .bail(),
  ]),
  login,
);

router.post(
  "/register",
  validate([
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .bail()
      .isString()
      .withMessage("username is not a string")
      .bail(),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .bail()
      .isString()
      .withMessage("password is not a string")
      .bail()
      .isLength({ min: 8, max: 100 })
      .withMessage("password is not between 8 and 100 characters")
      .bail(),
  ]),
  register,
);

router.get("/logout", logout);

router.post(
  "/:username/file/:fileId/publish",
  authenticateUsername,
  validate([
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .bail()
      .isString()
      .withMessage("title is not a string")
      .bail(),
    body("description")
      .optional()
      .isString()
      .withMessage("description is not a string")
      .bail(),
  ]),
  publishFile,
);

router.delete(
  "/:username/file/:fileId/publish",
  authenticateUsername,
  unpublishFile,
);

router.get("/:username/workspaces", authenticateUsername, getWorkspaces);

router.post(
  "/:username/workspace",
  authenticateUsername,
  validate([
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .bail()
      .isString()
      .withMessage("name is not a string")
      .bail(),
  ]),
  createWorkspace,
);

router.put(
  "/:username/workspace/:workspaceId",
  authenticateUsername,
  validate([
    body("name")
      .optional()
      .isString()
      .withMessage("name is not a string")
      .bail(),
    body("opened_files")
      .optional()
      .isArray()
      .withMessage("opened_files is not an array")
      .bail(),
    body("opened_files.*")
      .optional()
      .isString()
      .withMessage("opened_files is not an array of strings")
      .bail(),
    body("active_file")
      .optional()
      .isString()
      .withMessage("active_file is not a string")
      .bail(),
    body("active")
      .optional()
      .isBoolean()
      .withMessage("active is not a boolean")
      .bail(),
  ]),
  modifyWorkspace,
);

router.delete(
  "/:username/workspace/:workspaceId",
  authenticateUsername,
  deleteWorkspace,
);

router.post(
  "/:username/workspace/:workspaceId/file",
  authenticateUsername,
  validate([
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .bail()
      .isString()
      .withMessage("name is not a string")
      .bail(),
  ]),
  createFile,
);

router.get(
  "/:username/workspace/:workspaceId/file/:fileId",
  authenticateUsername,
  getFile,
);

router.put(
  "/:username/workspace/:workspaceId/file/:fileId",
  authenticateUsername,
  validate([
    body("content")
      .optional()
      .isString()
      .withMessage("content is not a string")
      .bail(),
    body("graphic")
      .notEmpty()
      .withMessage("graphic is required")
      .bail()
      .isString()
      .withMessage("graphic is not a string")
      .bail(),
    body("name")
      .optional()
      .isString()
      .withMessage("name is not a string")
      .bail(),
  ]),
  modifyFile,
);

router.delete(
  "/:username/workspace/:workspaceId/file/:fileId",
  authenticateUsername,
  deleteFile,
);

router.put(
  "/:username/workspace/:workspaceId/file/:fileId/close",
  authenticateUsername,
  closeFile,
);

// router.put(
//   "/:username/workspace/:workspaceId/file/:fileId/move",
//   authenticateUsername,
// );

export default router;
