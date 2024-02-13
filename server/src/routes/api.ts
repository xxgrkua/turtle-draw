import express from "express";
import fileRouter from "./file";
import userRouter from "./user";

const router = express.Router();

router.use("/user", userRouter);
router.use("/file", fileRouter);

export default router;
