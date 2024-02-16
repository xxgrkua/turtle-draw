import argon2 from "argon2";
import express from "express";

import type mongoose from "mongoose";
import HttpError from "../http_error";
import { File, PublishedFile, User, Workbench } from "../models";

export async function getMe(
  request: express.Request,
  response: express.Response,
) {
  response.json({
    user_id: request.session.user_id,
    username: request.session.username,
    nickname: request.session.nickname,
  });
}

export async function getUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = await User.findOne({ username: req.params.username })
      .where("deleted")
      .equals(false)
      .populate("published_files")
      .exec();
    if (user) {
      res.json({
        username: user.username,
        nickname: user.nickname,
        published_files: user.published_files,
      });
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

async function deleteWorkbench(userId: mongoose.Types.ObjectId) {
  const workbench = await Workbench.findById(userId).exec();
  if (workbench) {
    workbench.deleted = true;
    await workbench.save();
  }
}

async function deleteFiles(userId: mongoose.Types.ObjectId) {
  await Promise.all(
    (await File.find({ user_id: userId }).exec()).map((file) => {
      async () => {
        file.deleted = true;
        file.published = false;
        await file.save();
      };
    }),
  );
}

async function deletePublishedFiles(userId: mongoose.Types.ObjectId) {
  await PublishedFile.deleteMany({ author_id: userId }).exec();
}

export async function deleteUser(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const username = request.params.username;
    const user = await User.findOne({ username: username })
      .where("deleted")
      .equals(false)
      .exec();
    if (user) {
      await Promise.all([
        async () => {
          user.published_files.pull();
          user.deleted = true;
          await user.save();
        },
        deleteWorkbench(user._id),
        deleteFiles(user._id),
        deletePublishedFiles(user._id),
      ]);
      response.end();
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function modifyUser(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const username = request.params.username;
    const { nickname, password } = request.body;
    const user = await User.findOne({
      username: username,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (user) {
      if (nickname) {
        user.nickname = nickname;
      }
      if (password) {
        user.password_digest = await argon2.hash(password);
      }
      await user.save();
      request.session.regenerate(function (error) {
        if (error) {
          next(error);
        }
        if (nickname) {
          request.session.nickname = user.nickname;
        }
        request.session.save(function (err) {
          if (err) {
            next(err);
          }
          response.json({
            username: user.username,
            nickname: user.nickname,
            user_id: user._id,
          });
        });
      });
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function login(
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
    )
      .where("deleted")
      .equals(false)
      .exec();
    if (user) {
      if (await argon2.verify(user.password_digest, password)) {
        request.session.regenerate(function (error) {
          if (error) {
            next(error);
          }
          request.session.user_id = user._id;
          request.session.username = user.username;
          request.session.nickname = username.nickname;
          request.session.save(function (err) {
            if (err) {
              next(err);
            }
            response.json({
              user_id: user._id,
              username: user.username,
              nickname: user.nickname,
            });
          });
        });
      } else {
        next(
          new HttpError({
            status: 400,
            message: "password is incorrect",
          }),
        );
      }
    } else {
      next(
        new HttpError({
          status: 404,
          message: "user doesn't exist",
        }),
      );
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function register(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    let { username, nickname, password } = request.body;
    if (
      await User.findOne({ username: username })
        .where("deleted")
        .equals(false)
        .exec()
    ) {
      next(new HttpError({ status: 400, message: "user already exists" }));
    } else {
      nickname = nickname || username;
      const user = await User.create({
        username,
        nickname,
        password_digest: await argon2.hash(password),
        published_files: [],
        deleted: false,
      });
      const workspace = await Workbench.create({
        user_id: user._id,
        username: user.username,
        workspaces: [],
        deleted: false,
      });
      response.json({ username });
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function logout(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  request.session.user_id = null;
  request.session.username = null;
  request.session.nickname = null;
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
