import { nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { getInterpreter } from "rust-scheme";
import { createAppSlice } from "../../app/createAppSlice";
import { ApiErrorMessage } from "../../types/api";
import { UserSliceState, selectUserInfo } from "../user";

const Interpreters: { [file_id: string]: (code: string) => string } = {};

interface FileRef {
  id: string;
  name: string;
}

interface WorkspaceResponse {
  id: string;
  name: string;
  opened_files: string[];
  active_file: string | null;
  active_workspace: string;
}

export interface WorkspaceRef {
  id: string;
  name: string;
  files: FileRef[];
  opened_files: string[];
  active_file: string | null;
}

interface WorkbenchResponse {
  workspaces: WorkspaceRef[];
  active_workspace: string | null;
}

interface FileResponse {
  id: string;
  name: string;
  content: string;
  graphic: string;
}

interface CreateFileResponse extends FileResponse {
  workspace_id: string;
  workspace_files: string[];
  workspace_opened_files: string[];
  workspace_active_file: string;
}

interface TerminalState {
  history: string[];
  current: string;
}

interface GraphicsState {
  content: string;
}

interface FileState {
  id: string;
  name: string;
  content: string;
  terminal: TerminalState;
  graphic: GraphicsState;
  saved: boolean;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface WorkspaceState {
  id: string;
  name: string;
  fileRefs: FileRef[];
  files: { [id: string]: FileState };
  openedFiles: string[];
  activeFile: string | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface WorkbenchState {
  workspaceIds: string[];
  workspaces: { [id: string]: WorkspaceState };
  activeWorkspace: string | null;
  initState: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialWorkspaceId = nanoid();
const initialFileId = nanoid();
const initialWorkspaceName = "Workspace";
const initialFileName = "Untitled.scm";

const initialState: WorkbenchState = {
  workspaceIds: [initialWorkspaceId],
  workspaces: {
    [initialWorkspaceId]: {
      id: initialWorkspaceId,
      name: initialWorkspaceName,
      fileRefs: [{ id: initialFileId, name: initialFileName }],
      files: {
        [initialFileId]: {
          id: initialFileId,
          name: initialFileName,
          content: "",
          terminal: {
            history: [],
            current: "",
          },
          graphic: {
            content: "",
          },
          saved: true,
          state: "idle",
          error: null,
        },
      },
      openedFiles: [initialFileId],
      activeFile: initialFileId,
      state: "idle",
      error: null,
    },
  },
  activeWorkspace: initialWorkspaceId,
  initState: "idle",
  error: null,
};

export const workbenchSlice = createAppSlice({
  name: "workbench",
  initialState,
  reducers: (create) => ({
    initWorkbench: create.asyncThunk<WorkbenchResponse | null>(
      async (_, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.get<WorkbenchResponse>(
              `/api/user/${userInfo.username}/workspaces`,
            );
            return data;
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          return thunkAPI.fulfillWithValue(null);
        }
      },
      {
        pending: (state) => {
          state.initState = "loading";
        },

        fulfilled: (state, action) => {
          if (action.payload) {
            state.workspaceIds = action.payload.workspaces.map(
              (workspace) => workspace.id,
            );
            state.workspaces = {};
            for (const workspace of action.payload.workspaces) {
              state.workspaces[workspace.id] = {
                id: workspace.id,
                name: workspace.name,
                fileRefs: workspace.files,
                files: {},
                openedFiles: workspace.opened_files,
                activeFile: workspace.active_file,
                state: "idle",
                error: null,
              };
            }
            state.activeWorkspace = action.payload.active_workspace;
          }
          state.initState = "succeeded";
        },

        rejected: (state, action) => {
          state.initState = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    createWorkspace: create.asyncThunk(
      async (payload: { name: string }, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.post<WorkspaceRef>(
              `/api/user/${userInfo.username}/workspaces`,
              { name: payload.name },
            );
            return data;
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          if (!payload.name) {
            return thunkAPI.rejectWithValue("Workspace name is required");
          } else {
            return thunkAPI.fulfillWithValue({
              id: nanoid(),
              name: payload.name,
              files: [],
              opened_files: [],
              active_file: null,
            });
          }
        }
      },
      {
        pending: () => {},

        fulfilled: (state, action) => {
          state.workspaceIds.push(action.payload.id);
          state.workspaces[action.payload.id] = {
            id: action.payload.id,
            name: action.payload.name,
            fileRefs: action.payload.files,
            files: {},
            openedFiles: action.payload.opened_files,
            activeFile: action.payload.active_file,
            state: "idle",
            error: null,
          };
          state.activeWorkspace =
            state.workspaceIds[state.workspaceIds.length - 1];
        },
        rejected: (state, action) => {
          state.error = action.payload as string;
        },
      },
    ),

    deleteWorkspace: create.asyncThunk<
      { deleted_workspace: string; active_workspace?: string | null },
      { workspace_id: string }
    >(
      async (payload: { workspace_id: string }, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.delete<{
              active_workspace: string | null;
            }>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}`,
            );
            return {
              deleted_workspace: payload.workspace_id,
              active_workspace: data.active_workspace,
            };
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          return thunkAPI.fulfillWithValue({
            deleted_workspace: payload.workspace_id,
          });
        }
      },
      {
        pending: () => {},

        fulfilled: (state, action) => {
          if (action.payload.active_workspace !== undefined) {
            state.activeWorkspace = action.payload.active_workspace;
          } else {
            const index = state.workspaceIds.indexOf(
              action.payload.deleted_workspace,
            );
            if (index > 0) {
              state.activeWorkspace = state.workspaceIds[index - 1];
            } else {
              if (state.workspaceIds.length > 1) {
                state.activeWorkspace = state.workspaceIds[1];
              } else {
                state.activeWorkspace = null;
              }
            }
          }
          state.workspaceIds = state.workspaceIds.filter(
            (id) => id !== action.payload.deleted_workspace,
          );
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete state.workspaces[action.payload.deleted_workspace];
        },

        rejected: (state, action) => {
          state.error = action.payload as string;
        },
      },
    ),

    updateWorkspace: create.asyncThunk(
      async (
        payload: {
          workspace_id: string;
          name?: string;
          active?: boolean;
          active_file?: string;
          opened_files?: string[];
        },
        thunkAPI,
      ) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.put<WorkspaceResponse>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}`,
              {
                name: payload.name,
                active: payload.active,
                opened_files: payload.opened_files,
                active_file: payload.active_file,
              },
            );
            return data;
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          const state = thunkAPI.getState() as {
            workbench: WorkbenchState;
          };
          const workspace = state.workbench.workspaces[payload.workspace_id];
          const opened_files = payload.opened_files ?? [
            ...workspace.openedFiles,
          ];
          const active_file = payload.active_file ?? workspace.activeFile;
          if (active_file && !opened_files.includes(active_file)) {
            opened_files.push(active_file);
          }
          return thunkAPI.fulfillWithValue({
            id: payload.workspace_id,
            name: payload.name ?? workspace.name,
            opened_files: opened_files,
            active_workspace: payload.active
              ? payload.workspace_id
              : state.workbench.activeWorkspace,
            active_file: active_file,
          });
        }
      },
      {
        pending: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].state = "loading";
        },

        fulfilled: (state, action) => {
          state.workspaces[action.payload.id].state = "succeeded";
          state.workspaces[action.payload.id].name = action.payload.name;
          state.activeWorkspace = action.payload.active_workspace;
          state.workspaces[action.payload.id].openedFiles =
            action.payload.opened_files;
          state.workspaces[action.payload.id].activeFile =
            action.payload.active_file;
        },

        rejected: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].state = "failed";
          state.workspaces[action.meta.arg.workspace_id].error =
            action.payload as string;
        },
      },
    ),

    initFile: create.asyncThunk(
      async (payload: { workspace_id: string; file_id: string }, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.get<FileResponse>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}/files/${payload.file_id}`,
            );
            return data;
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          thunkAPI.fulfillWithValue(null);
        }
      },
      {
        pending: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "loading";
        },

        fulfilled: (state, action) => {
          if (action.payload) {
            state.workspaces[action.meta.arg.workspace_id].files[
              action.meta.arg.file_id
            ].state = "succeeded";
            state.workspaces[action.meta.arg.workspace_id].files[
              action.meta.arg.file_id
            ].content = action.payload.content;
            state.workspaces[action.meta.arg.workspace_id].files[
              action.meta.arg.file_id
            ].graphic.content = action.payload.graphic;
          }
        },

        rejected: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "failed";
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].error = action.payload as string;
        },
      },
    ),

    createFile: create.asyncThunk<
      CreateFileResponse | FileResponse,
      { workspace_id: string; name: string }
    >(
      async (payload: { workspace_id: string; name: string }, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.post<CreateFileResponse>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}/file`,
              { name: payload.name },
            );
            return data;
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          const state = thunkAPI.getState() as { workbench: WorkbenchState };
          if (!payload.name) {
            return thunkAPI.rejectWithValue("File name is required");
          } else if (
            state.workbench.workspaces[payload.workspace_id].fileRefs.find(
              ({ name }) => {
                return name === payload.name;
              },
            )
          ) {
            return thunkAPI.rejectWithValue(
              "File with the same name already exists",
            );
          } else {
            return thunkAPI.fulfillWithValue({
              id: nanoid(),
              name: payload.name,
              content: "",
              graphic: "",
            });
          }
        }
      },
      {
        pending: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].state = "loading";
        },

        fulfilled: (state, action) => {
          if ("workspace_id" in action.payload) {
            state.workspaces[action.payload.workspace_id].state = "succeeded";
            state.workspaces[action.payload.workspace_id].fileRefs.push({
              id: action.payload.id,
              name: action.payload.name,
            });
            state.workspaces[action.payload.workspace_id].files[
              action.payload.id
            ] = {
              id: action.payload.id,
              name: action.payload.name,
              content: action.payload.content,
              terminal: {
                history: [],
                current: "",
              },
              graphic: {
                content: action.payload.graphic,
              },
              saved: true,
              state: "idle",
              error: null,
            };
            state.workspaces[action.payload.workspace_id].openedFiles.push(
              action.payload.id,
            );
            state.workspaces[action.payload.workspace_id].activeFile =
              action.payload.id;
          } else {
            state.workspaces[action.meta.arg.workspace_id].state = "succeeded";
            state.workspaces[action.meta.arg.workspace_id].fileRefs.push({
              id: action.payload.id,
              name: action.payload.name,
            });
            state.workspaces[action.meta.arg.workspace_id].files[
              action.payload.id
            ] = {
              id: action.payload.id,
              name: action.payload.name,
              content: action.payload.content,
              terminal: {
                history: [],
                current: "",
              },
              graphic: {
                content: action.payload.graphic,
              },
              saved: true,
              state: "idle",
              error: null,
            };
            state.workspaces[action.meta.arg.workspace_id].openedFiles.push(
              action.payload.id,
            );
            state.workspaces[action.meta.arg.workspace_id].activeFile =
              action.payload.id;
          }
          Interpreters[action.payload.id] = getInterpreter();
        },

        rejected: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].state = "failed";
          state.workspaces[action.meta.arg.workspace_id].error =
            action.payload as string;
        },
      },
    ),

    deleteFile: create.asyncThunk<
      { active_file?: string | null; deleted_file: string },
      { workspace_id: string; file_id: string }
    >(
      async (payload: { workspace_id: string; file_id: string }, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.delete<{ active_file: string | null }>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}/files/${payload.file_id}`,
            );
            return {
              active_file: data.active_file,
              deleted_file: payload.file_id,
            };
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          return thunkAPI.fulfillWithValue({
            deleted_file: payload.file_id,
          });
        }
      },
      {
        pending: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "loading";
        },

        fulfilled: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.payload.deleted_file
          ].state = "succeeded";
          if (action.payload.active_file !== undefined) {
            state.workspaces[action.meta.arg.workspace_id].activeFile =
              action.payload.active_file;
          } else {
            if (
              state.workspaces[
                action.meta.arg.workspace_id
              ].openedFiles.includes(action.payload.deleted_file)
            ) {
              const index = state.workspaces[
                action.meta.arg.workspace_id
              ].openedFiles.indexOf(action.payload.deleted_file);
              if (index > 0) {
                state.workspaces[action.meta.arg.workspace_id].activeFile =
                  state.workspaces[action.meta.arg.workspace_id].openedFiles[
                    index - 1
                  ];
              } else {
                if (
                  state.workspaces[action.meta.arg.workspace_id].openedFiles
                    .length > 1
                ) {
                  state.workspaces[action.meta.arg.workspace_id].activeFile =
                    state.workspaces[
                      action.meta.arg.workspace_id
                    ].openedFiles[1];
                } else {
                  state.workspaces[action.meta.arg.workspace_id].activeFile =
                    null;
                }
              }
            }
          }
          state.workspaces[action.meta.arg.workspace_id].fileRefs =
            state.workspaces[action.meta.arg.workspace_id].fileRefs.filter(
              ({ id }) => id !== action.payload.deleted_file,
            );
          delete state.workspaces[action.meta.arg.workspace_id].files[
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            action.payload.deleted_file
          ];
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete Interpreters[action.payload.deleted_file];
        },

        rejected: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "failed";
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].error = action.payload as string;
        },
      },
    ),

    updateFile: create.asyncThunk(
      async (
        payload: {
          workspace_id: string;
          file_id: string;
          name?: string;
          content?: string;
          graphic?: string;
        },
        thunkAPI,
      ) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.put<FileResponse>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}/files/${payload.file_id}`,
              {
                name: payload.name,
                content: payload.content,
                graphic: payload.graphic,
              },
            );
            return data;
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          return thunkAPI.fulfillWithValue({
            id: payload.file_id,
            name: payload.name,
            content: payload.content,
            graphic: payload.graphic,
          });
        }
      },
      {
        pending: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "loading";
        },

        fulfilled: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.payload.id
          ].state = "succeeded";
          state.workspaces[action.meta.arg.workspace_id].files[
            action.payload.id
          ].name =
            action.payload.name ??
            state.workspaces[action.meta.arg.workspace_id].files[
              action.payload.id
            ].name;
          state.workspaces[action.meta.arg.workspace_id].files[
            action.payload.id
          ].content =
            action.payload.content ??
            state.workspaces[action.meta.arg.workspace_id].files[
              action.payload.id
            ].content;
          state.workspaces[action.meta.arg.workspace_id].files[
            action.payload.id
          ].graphic.content =
            action.payload.graphic ??
            state.workspaces[action.meta.arg.workspace_id].files[
              action.payload.id
            ].graphic.content;
        },

        rejected: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "failed";
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].error = action.payload as string;
        },
      },
    ),

    closeFile: create.asyncThunk<
      {
        active_file?: string | null;
        opened_files?: string[];
        closed_file: string;
      },
      { workspace_id: string; file_id: string }
    >(
      async (payload: { workspace_id: string; file_id: string }, thunkAPI) => {
        const userInfo = selectUserInfo(
          thunkAPI.getState() as { user: UserSliceState },
        );
        if (userInfo) {
          try {
            const { data } = await axios.put<{
              active_file: string | null;
              opened_files: string[];
            }>(
              `/api/user/${userInfo.username}/workspaces/${payload.workspace_id}/files/${payload.file_id}/close`,
            );
            return {
              active_file: data.active_file,
              opened_files: data.opened_files,
              closed_file: payload.file_id,
            };
          } catch (error) {
            if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
              return thunkAPI.rejectWithValue(error.response.data.error);
            } else {
              throw error;
            }
          }
        } else {
          return thunkAPI.fulfillWithValue({
            closed_file: payload.file_id,
          });
        }
      },
      {
        pending: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "loading";
        },

        fulfilled: (state, action) => {
          if (
            action.payload.active_file !== undefined &&
            action.payload.opened_files !== undefined
          ) {
            state.workspaces[action.meta.arg.workspace_id].activeFile =
              action.payload.active_file;
            state.workspaces[action.meta.arg.workspace_id].openedFiles =
              action.payload.opened_files;
          } else {
            if (
              state.workspaces[
                action.meta.arg.workspace_id
              ].openedFiles.includes(action.payload.closed_file)
            ) {
              const index = state.workspaces[
                action.meta.arg.workspace_id
              ].openedFiles.indexOf(action.payload.closed_file);
              if (index > 0) {
                state.workspaces[action.meta.arg.workspace_id].activeFile =
                  state.workspaces[action.meta.arg.workspace_id].openedFiles[
                    index - 1
                  ];
              } else {
                if (
                  state.workspaces[action.meta.arg.workspace_id].openedFiles
                    .length > 1
                ) {
                  state.workspaces[action.meta.arg.workspace_id].activeFile =
                    state.workspaces[
                      action.meta.arg.workspace_id
                    ].openedFiles[1];
                } else {
                  state.workspaces[action.meta.arg.workspace_id].activeFile =
                    null;
                }
              }
              state.workspaces[action.meta.arg.workspace_id].openedFiles =
                state.workspaces[
                  action.meta.arg.workspace_id
                ].openedFiles.filter((id) => id !== action.payload.closed_file);
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete Interpreters[action.payload.closed_file];
        },

        rejected: (state, action) => {
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].state = "failed";
          state.workspaces[action.meta.arg.workspace_id].files[
            action.meta.arg.file_id
          ].error = action.payload as string;
        },
      },
    ),
  }),

  selectors: {
    selectAllWorkspaceIds: (state) => state.workspaceIds,
    selectWorkspaceById: (state, workspace_id: string) =>
      state.workspaces[workspace_id],
    selectAllWorkspaces: (state) => {
      return state.workspaceIds.map((id) => {
        return state.workspaces[id];
      });
    },
    selectWorkbenchError: (state) => state.error,
    selectWorkbenchState: (state) => state.initState,
    selectFileById: (state, workspace_id: string, file_id: string) => {
      const workspace = state.workspaces[workspace_id];
      return workspace.files[file_id];
    },
    selectActiveWorkspace: (state) => {
      if (state.activeWorkspace) {
        return state.workspaces[state.activeWorkspace];
      } else {
        return null;
      }
    },
    selectInterpreterById: (state, file_id: string) => {
      return Interpreters[file_id];
    },
    selectWorkbenchInitState: (state) => state.initState,
    selectActiveWorkspaceId: (state) => state.activeWorkspace,
    selectOpenedFileRefs: (state, workspace_id: string) => {
      return state.workspaces[workspace_id].openedFiles.map((id) => {
        return state.workspaces[workspace_id].fileRefs.find(
          (file) => file.id === id,
        );
      });
    },
  },
});

export const {
  selectActiveWorkspace,
  selectAllWorkspaces,
  selectAllWorkspaceIds,
  selectFileById,
  selectWorkbenchError,
  selectWorkbenchState,
  selectWorkspaceById,
  selectInterpreterById,
  selectWorkbenchInitState,
  selectActiveWorkspaceId,
} = workbenchSlice.selectors;

export const {
  initWorkbench,
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
  initFile,
  createFile,
  deleteFile,
  updateFile,
  closeFile,
} = workbenchSlice.actions;
