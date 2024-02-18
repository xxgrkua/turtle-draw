import express from "express";
import { type ParamsDictionary } from "express-serve-static-core";
import mongoose from "mongoose";

import { ApiError } from "../http_error";
import { File, PublishedFile, User, Workbench } from "../models";

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
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function getFile(
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
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    const workspace = workbench?.workspaces.id(request.params.workspaceId);
    if (file && workspace?.files.includes(file._id)) {
      response.json({
        id: file._id,
        name: file.name,
        content: file.content,
        graphic: file.graphic,
      });
    } else {
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function createFile(
  request: express.Request<ParamsDictionary, any, { name: string }>,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    const user = await User.findOne({
      username: request.params.username,
    }).exec();
    if (workbench && user) {
      const workspace = workbench.workspaces.id(request.params.workspaceId);
      if (workspace) {
        const file = await File.create({
          name: request.body.name,
          content: "",
          graphic: { content: "" },
          user_id: user._id,
          username: user.username,
          published: false,
          deleted: false,
        });
        workspace.files.push(file._id);
        workspace.opened_files.push(file._id);
        workspace.active_file = file._id;
        workbench.active_workspace = workspace._id;
        await workbench.save();
        response.json({
          id: file._id,
          name: file.name,
          content: file.content,
          graphic: file.graphic.content,
          workspace_id: workspace._id,
          workspace_files: workspace.files,
          workspace_opened_files: workspace.opened_files,
          workspace_active_file: workspace.active_file,
        });
      } else {
        next(new ApiError({ status: 404, message: "workspace doesn't exist" }));
      }
    } else {
      next(new ApiError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function modifyFile(
  request: express.Request<
    ParamsDictionary,
    any,
    { content: string; graphic: string; name?: string }
  >,
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
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    const workspace = workbench?.workspaces.id(request.params.workspaceId);
    if (file && workspace?.files.includes(file._id)) {
      file.content = request.body.content || file.content;
      file.graphic = { content: request.body.graphic || file.graphic.content };
      file.name = request.body.name || file.name;
      await file.save();
      response.json({
        id: file._id,
        name: file.name,
        content: file.content,
        graphic: file.graphic,
      });
    } else {
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

async function deleteOnePublishedFileFromUser(
  user_id: mongoose.Types.ObjectId,
  file_id: mongoose.Types.ObjectId,
) {
  const user = await User.findById(user_id).exec();
  user?.published_files.pull(file_id);
  await user?.save();
}

export async function deleteFile(
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
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    const workspace = workbench?.workspaces.id(request.params.workspaceId);
    if (file && workspace?.files.includes(file._id)) {
      await Promise.all([
        async () => {
          file.deleted = true;
          await file.save();
        },
        async () => {
          await PublishedFile.deleteOne({ file_id: file._id }).exec();
        },
        deleteOnePublishedFileFromUser(file.user_id, file._id),
        async () => {
          if (workspace.opened_files.includes(file._id)) {
            // file is opened
            // so we need to find another file to be active
            const index = workspace.opened_files.indexOf(file._id);
            if (index > 0) {
              workspace.active_file = workspace.opened_files[index - 1];
            } else {
              if (workspace.files.length > 1) {
                workspace.active_file = workspace.files[1];
              } else {
                workspace.active_file = undefined;
              }
            }
            workspace.files.pull(file._id);
            workspace.opened_files.pull(file._id);
          } else {
            // file is not opened
            // so active file is not changed
            workspace.files.pull(file._id);
          }

          await workbench?.save();
        },
      ]);
      response.json({
        active_file: workspace.active_file || null,
      });
    } else {
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function closeFile(
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
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    const workspace = workbench?.workspaces.id(request.params.workspaceId);
    if (
      file &&
      workspace?.files.includes(file._id) &&
      workspace.opened_files.includes(file._id)
    ) {
      if (workspace.active_file === file._id) {
        const index = workspace.opened_files.indexOf(file._id);
        if (index > 0) {
          workspace.active_file = workspace.opened_files[index - 1];
        } else {
          if (workspace.files.length > 1) {
            workspace.active_file = workspace.files[1];
          } else {
            workspace.active_file = undefined;
          }
        }
      }
      workspace.opened_files.pull(file._id);

      await workbench?.save();
      response.json({
        active_file: workspace.active_file || null,
        opened_files: workspace.opened_files,
      });
    } else {
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function publishFile(
  request: express.Request<
    ParamsDictionary,
    any,
    { title: string; description?: string }
  >,
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
    const user = await User.findOne({ username: request.params.username })
      .where("deleted")
      .equals(false)
      .exec();
    if (file && user) {
      await Promise.all([
        async () => {
          file.published = true;
          await file.save();
        },
        async () => {
          user.published_files.addToSet(file._id);
          await user.save();
        },
        async () => {
          await PublishedFile.findOneAndUpdate(
            { file_id: file._id },
            {
              title: request.body.title,
              description: request.body.description || "",
              image: file.graphic.content,
              author_id: file.user_id,
              author: file.username,
            },
            {
              new: true,
              upsert: true,
            },
          ).exec();
        },
      ]);
      response.json({ file_id: file._id });
    } else {
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
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
      next(new ApiError({ status: 400, message: "file not published" }));
    }
    const user = await User.findOne({ username: request.params.username })
      .where("deleted")
      .equals(false)
      .exec();
    if (file && user) {
      await Promise.all([
        async () => {
          file.published = false;
          await file.save();
        },
        async () => {
          await PublishedFile.deleteOne({ file_id: file._id }).exec();
        },
        async () => {
          user.published_files.pull(file._id);
          await user.save();
        },
      ]);
      response.end();
    } else {
      next(new ApiError({ status: 404, message: "file doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}
