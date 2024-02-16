import express from "express";
import { type ParamsDictionary } from "express-serve-static-core";
import type mongoose from "mongoose";

import HttpError from "../http_error";
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
        workspaces: workbench.workspaces.filter((ws) => !ws.deleted),
        active_workspace: workbench.active_workspace,
      });
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
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
        workspaces: workbench.workspaces.filter((ws) => !ws.deleted),
        active_workspace: workbench.active_workspace,
      });
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
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
          workspaces: workbench.workspaces.filter((ws) => !ws.deleted),
          active_workspace: workbench.active_workspace,
        });
      } else {
        next(
          new HttpError({ status: 404, message: "workspace doesn't exist" }),
        );
      }
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
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
                async () => {
                  if (
                    !workspace.files.includes(file_id) ||
                    !(await File.findById(file_id)
                      .where("deleted")
                      .equals(false)
                      .exec())
                  ) {
                    next(
                      new HttpError({
                        status: 404,
                        message: "file doesn't exist",
                      }),
                    );
                  }
                };
              },
            ),
          );
          workspace.opened_files = request.body
            .opened_files as mongoose.Types.Array<mongoose.Types.ObjectId>;
        }
        workbench.active_workspace = request.body.active
          ? workspace._id
          : workbench.active_workspace;

        await workbench.save();
      } else {
        next(
          new HttpError({ status: 404, message: "workspace doesn't exist" }),
        );
      }
    } else {
      next(new HttpError({ status: 404, message: "user doesn't exist" }));
    }
  } catch (error) {
    next(new HttpError({ status: 500, cause: error }));
  }
}
