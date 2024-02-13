import express from "express";
import { getPublishedFile } from "../controllers/file";

const router = express.Router();

router.use("/:fileId", getPublishedFile);

export default router;
