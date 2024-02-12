import express from "express";
import login from "../controllers/login";
import { userGet } from "../controllers/user";

const router = express.Router();

router.get("/user/:userId", userGet);

router.post("/login", login);

router.use(async (request, response, next) => {
  next("ssss");
});

export default router;
