import { createAppSlice } from "../../app/createAppSlice";

interface TerminalState {
  history: string[];
  current: string;
}

interface GraphicsState {}

interface FileState {
  active: boolean;
  name: string;
  content: string;
  terminal: TerminalState;
  graphics: GraphicsState;
}

interface WorkspaceState {
  name: string;
  files: FileState[];
}

interface WorkbenchState {
  workspaces: WorkspaceState;
}

const initialState: WorkbenchState = {
  workspaces: {
    name: "workspace 1",
    files: [
      {
        active: true,
        name: "untitled.scm",
        content: "",
        terminal: {
          history: [],
          current: "",
        },
        graphics: {},
      },
    ],
  },
};

export const workbenchSlice = createAppSlice({
  name: "workbench",
  initialState,
  reducers: {},
});

export default workbenchSlice.actions;
