import express from "express";

import mongoose from "mongoose";
import HttpError from "../http_error";
import { File, PublishedFile, User } from "../models";

export async function getPublishedFile(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const fileId = request.params.fileId;
    const file = await File.findById(fileId)
      .where("published")
      .equals(true)
      .where("deleted")
      .equals(false)
      .exec();
    if (file) {
      response.json({
        name: file.name,
        content: file.content,
        graphic: file.graphic,
      });
    } else {
      next(new HttpError({ status: 400, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function getUserFile(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const file = await File.findOne({
      username: request.params.username,
      _id: request.params.fileId,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (file) {
      response.json({
        name: file.name,
        content: file.content,
        graphic: file.graphic,
      });
    } else {
      next(new HttpError({ status: 400, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function editUserFile(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const file = await File.findOne({
      username: request.params.username,
      _id: request.params.fileId,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (file) {
      file.content = request.body.content;
      file.graphic = request.body.graphic;
      await file.save();
      response.json({ file_id: file._id });
    } else {
      next(new HttpError({ status: 400, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

async function deleteOnePublishedFileFromUser(
  user_id: mongoose.Types.ObjectId,
  file_id: mongoose.Types.ObjectId,
) {
  const user = await User.findById(user_id).exec();
  await user?.updateOne({ $pull: { published_files: file_id } }).exec();
  await user?.save();
}

export async function deleteUserFile(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const file = await File.findOne({
      username: request.params.username,
      _id: request.params.fileId,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (file) {
      Promise.all([
        async () => {
          file.deleted = true;
          await file.save();
        },
        async () => {
          await PublishedFile.deleteOne({ file_id: file._id }).exec();
        },
        deleteOnePublishedFileFromUser(file.user_id, file._id),
      ]);
      response.end();
    } else {
      next(new HttpError({ status: 400, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function publishFile(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const file = await File.findOne({
      username: request.params.username,
      _id: request.params.fileId,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (file?.published) {
      next(new HttpError({ status: 400, message: "file already published" }));
    }
    const user = await User.findOne({ username: request.params.username })
      .where("deleted")
      .equals(false)
      .exec();
    if (file && user) {
      Promise.all([
        async () => {
          file.published = true;
          await file.save();
        },
        async () => {
          await user
            .updateOne({ $addToSet: { published_files: file._id } })
            .exec();
          await user.save();
        },
        // TODO: add published file
        // async () => {
        //   PublishedFile.create({
        //     file_id: file._id,
        //     author_id: file.user_id,
        //     author_name: file.username,
        //   });
        // },
      ]);
      response.json({ file_id: file._id });
    } else {
      next(new HttpError({ status: 400, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}

export async function unpublishFile(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const file = await File.findOne({
      username: request.params.username,
      _id: request.params.fileId,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (!file?.published) {
      next(new HttpError({ status: 400, message: "file not published" }));
    }
    const user = await User.findOne({ username: request.params.username })
      .where("deleted")
      .equals(false)
      .exec();
    if (file && user) {
      Promise.all([
        async () => {
          file.published = false;
          await file.save();
        },
        async () => {
          await PublishedFile.deleteOne({ file_id: file._id }).exec();
        },
        async () => {
          await user.updateOne({ $pull: { published_files: file._id } }).exec();
          await user.save();
        },
      ]);
      response.end();
    } else {
      next(new HttpError({ status: 400, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}
