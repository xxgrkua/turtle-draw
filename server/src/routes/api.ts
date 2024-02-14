import express from "express";
import fileRouter from "./file";
import galleryRouter from "./gallery";
import userRouter from "./user";

const router = express.Router();

router.use("/user", userRouter);
router.use("/file", fileRouter);
router.use("/gallery", galleryRouter);

export default router;
