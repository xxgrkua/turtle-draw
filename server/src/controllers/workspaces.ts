import express from "express";
import { type ParamsDictionary } from "express-serve-static-core";
import type mongoose from "mongoose";

import { ApiError } from "../http_error";
import { File, Workbench } from "../models";

export async function getWorkspaces(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const workbench = await Workbench.findOne({
      username: request.params.username,
    })
      .where("deleted")
      .equals(false)
      .exec();
    if (workbench) {
      response.json({
        workspaces: workbench.workspaces
          .filter((ws) => !ws.deleted)
          .map((ws) => {
            return {
              id: ws._id,
              name: ws.name,
              files: ws.files.map((file) => {
                return { id: file._id, name: file.name };
              }),
              opened_files: ws.opened_files,
              active_file: ws.active_file || null,
            };
          }),
        active_workspace: workbench.active_workspace,
      });
    } else {
      next(new ApiError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function createWorkspace(
  request: express.Request<ParamsDictionary, any, { name: string }>,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    if (workbench) {
      workbench.workspaces.push({
        name: request.body.name,
        files: [],
        opened_files: [],
        active_file: undefined,
        deleted: false,
      });
      workbench.active_workspace =
        workbench.workspaces[workbench.workspaces.length - 1]._id;
      await workbench.save();
      response.json({
        id: workbench.active_workspace,
        name: request.body.name,
        files: [],
        opened_files: [],
        active_file: null,
      });
    } else {
      next(new ApiError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}

export async function deleteWorkspace(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    if (workbench) {
      const workspace = workbench.workspaces.id(request.params.workspaceId);
      if (workspace) {
        const undeletedWorkspaces = workbench.workspaces.filter(
          (ws) => !ws.deleted,
        );
        const index = undeletedWorkspaces.indexOf(workspace);
        if (index > 0) {
          workbench.active_workspace = undeletedWorkspaces[index - 1]._id;
        } else {
          if (undeletedWorkspaces.length > 1) {
            workbench.active_workspace = undeletedWorkspaces[1]._id;
          } else {
            workbench.active_workspace = undefined;
          }
        }
        workspace.deleted = true;
        await workbench.save();
        response.json({
          active_workspace: workbench.active_workspace || null,
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

export async function modifyWorkspace(
  request: express.Request<
    ParamsDictionary,
    any,
    {
      name?: string;
      active?: boolean;
      opened_files?: mongoose.Types.ObjectId[];
      active_file?: mongoose.Types.ObjectId;
    }
  >,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const workbench = await Workbench.findOne({
      username: request.params.username,
    }).exec();
    if (workbench) {
      const workspace = workbench.workspaces.id(request.params.workspaceId);
      if (workspace && !workspace.deleted) {
        workspace.name = request.body.name || workspace.name;
        workbench.active_workspace = request.body.active
          ? workspace._id
          : workbench.active_workspace || workspace._id;
        if (request.body.opened_files) {
          await Promise.all(
            request.body.opened_files.map(
              (file_id: mongoose.Types.ObjectId) => {
                return (async () => {
                  if (
                    !workspace.files.id(file_id) ||
                    !(await File.findById(file_id)
                      .where("deleted")
                      .equals(false)
                      .exec())
                  ) {
                    next(
                      new ApiError({
                        status: 404,
                        message: "file doesn't exist",
                      }),
                    );
                  }
                })();
              },
            ),
          );
          workspace.opened_files = request.body
            .opened_files as mongoose.Types.Array<mongoose.Types.ObjectId>;
        }
        workbench.active_workspace = request.body.active
          ? workspace._id
          : workbench.active_workspace;
        if (request.body.active_file) {
          if (!workspace.files.id(request.body.active_file)) {
            next(
              new ApiError({
                status: 404,
                message: "file doesn't exist",
              }),
            );
            return;
          } else if (
            !workspace.opened_files.includes(request.body.active_file)
          ) {
            workspace.opened_files.push(request.body.active_file);
          }
          workspace.active_file = request.body.active_file;
        }

        await workbench.save();

        response.json({
          id: workspace._id,
          name: workspace.name,
          opened_files: workspace.opened_files,
          active_file: workspace.active_file || null,
          active_workspace: workbench.active_workspace,
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
