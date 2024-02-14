import express from "express";
import { getGallery } from "../controllers/gallery";

const router = express.Router();

router.get("/", getGallery);

export default router;
