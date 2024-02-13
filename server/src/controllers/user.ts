import argon2 from "argon2";
import express from "express";

import HttpError from "../http_error";
import { User } from "../models";

async function get(
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

async function login(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const { username, password } = request.body;
    const user = await User.findOne(
      {
        username: username,
      },
      "username password_digest",
    ).exec();
    if (user && (await argon2.verify(user.password_digest, password))) {
      request.session.regenerate(function (error) {
        if (error) {
          next(error);
        }
        request.session.user_id = user._id;
        request.session.username = user.username;
        request.session.save(function (err) {
          if (err) {
            next(err);
          }
          response.json({ username: user.username });
        });
      });
    } else {
      next(
        new HttpError({
          status: 400,
          message: "user doesn't exist or password is wrong",
        }),
      );
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

async function register(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    let { username, nickname, password } = request.body;
    if (await User.findOne({ username: username }).exec()) {
      next(new HttpError({ status: 400, message: "user already exists" }));
    } else {
      nickname = nickname || username;
      User.create({
        username,
        nickname,
        password_digest: await argon2.hash(password),
      });
      response.json({ username });
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

async function logout(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  request.session.user_id = null;
  request.session.username = null;
  request.session.save(function (error) {
    if (error) {
      next(error);
    }
    request.session.regenerate(function (err) {
      if (err) {
        next(err);
      }
      response.end();
    });
  });
}

export { get, login, logout, register };
