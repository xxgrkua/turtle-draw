import { PayloadAction, nanoid } from "@reduxjs/toolkit";
import { getInterpreter } from "rust-scheme";
import { createAppSlice } from "../../app/createAppSlice";

interface TerminalState {
  interpreter: (code: string) => string;
  history: string[];
  current: string;
}

interface GraphicsState {
  content: string;
}

interface FileState {
  id: string;
  _id?: string;
  name: string;
  content: string;
  terminal: TerminalState;
  graphics: GraphicsState;
}

interface WorkspaceState {
  id: string;
  _id?: string;
  name: string;
  files: FileState[];
  activeFile?: string;
}

interface WorkbenchState {
  workspaces: WorkspaceState[];
  activeWorkspace?: string;
}

const initialState: WorkbenchState = {
  workspaces: [
    {
      id: nanoid(),
      name: "workspace 1",
      files: [
        {
          id: nanoid(),
          name: "untitled.scm",
          content: "",
          terminal: {
            interpreter: getInterpreter(),
            history: [],
            current: "",
          },
          graphics: {
            content: "",
          },
        },
      ],
    },
  ],
};

export const workbenchSlice = createAppSlice({
  name: "workbench",
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<{ name: string }>) => {
      state.workspaces.push({
        id: nanoid(),
        name: action.payload.name,
        files: [],
      });
    },

    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload,
      );
    },

    renameWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; name: string }>,
    ) => {
      const workspace = state.workspaces.find(
        (workspace) => workspace.id === action.payload.workspaceId,
      );
      if (workspace) {
        workspace.name = action.payload.name;
      }
    },

    addFile: (
      state,
      action: PayloadAction<{ workspaceId: string; name: string }>,
    ) => {
      const workspace = state.workspaces.find(
        (workspace) => workspace.id === action.payload.workspaceId,
      );
      if (workspace) {
        workspace.files.push({
          id: nanoid(),
          name: action.payload.name,
          content: "",
          terminal: {
            interpreter: getInterpreter(),
            history: [],
            current: "",
          },
          graphics: {
            content: "",
          },
        });
      }
    },

    removeFile: (
      state,
      action: PayloadAction<{ workspaceId: string; fileId: string }>,
    ) => {
      const workspace = state.workspaces.find(
        (workspace) => workspace.id === action.payload.workspaceId,
      );
      if (workspace) {
        workspace.files = workspace.files.filter(
          (file) => file.id !== action.payload.fileId,
        );
      }
    },

    renameFile: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        fileId: string;
        name: string;
      }>,
    ) => {
      const workspace = state.workspaces.find(
        (workspace) => workspace.id === action.payload.workspaceId,
      );
      if (workspace) {
        const file = workspace.files.find(
          (file) => file.id === action.payload.fileId,
        );
        if (file) {
          file.name = action.payload.name;
        }
      }
    },

    updateFile: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        fileId: string;
        content: string;
        history: string[];
        current: string;
        graphics: string;
      }>,
    ) => {
      const workspace = state.workspaces.find(
        (workspace) => workspace.id === action.payload.workspaceId,
      );
      if (workspace) {
        const file = workspace.files.find(
          (file) => file.id === action.payload.fileId,
        );
        if (file) {
          file.content = action.payload.content;
          file.terminal.history = action.payload.history;
          file.terminal.current = action.payload.current;
          file.graphics.content = action.payload.graphics;
        }
      }
    },
  },
});

export default workbenchSlice.reducer;
