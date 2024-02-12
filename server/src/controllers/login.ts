import express from "express";
import { User } from "../models";

async function login(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const { login_name, password } = request.body;
    console.log(login_name, password);
    const user = await User.findOne({
      login_name,
    }).exec();
    if (user) {
      response.json(user);
    } else {
      throw Error(request.body.login_name);
    }
  } catch (error) {
    next(error);
  }
}

export default login;
