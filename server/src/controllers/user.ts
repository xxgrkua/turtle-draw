import express from "express";
import { User } from "../models";

async function userGet(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = await User.findById(req.params.userId).exec();
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export { userGet };
