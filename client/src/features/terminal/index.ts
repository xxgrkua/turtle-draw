import { Interpreter } from "rust-scheme";
import { createAppSlice } from "../../app/createAppSlice";

interface TerminalState {
  history: string[];
  current: string;
}

interface WorkbenchTerminalState {
  [file_id: string]: TerminalState;
}

const Interpreters: { [file_id: string]: Interpreter } = {};

const initialWorkbenchTerminalState: WorkbenchTerminalState = {};

export const terminalSlice = createAppSlice({
  name: "terminal",
  initialState: initialWorkbenchTerminalState,
  reducers: (create) => ({
    initTerminal: create.reducer(
      (state, action: { payload: { file_id: string } }) => {
        if (!(action.payload.file_id in state)) {
          state[action.payload.file_id] = {
            history: [],
            current: "",
          };
          Interpreters[action.payload.file_id] = new Interpreter();
        }
      },
    ),

    updateHistory: create.reducer(
      (state, action: { payload: { file_id: string; out: string } }) => {
        if (!(action.payload.file_id in state)) {
          state[action.payload.file_id] = {
            history: [],
            current: "",
          };
        }
        state[action.payload.file_id].history.push(action.payload.out);
      },
    ),

    setCurrent: create.reducer(
      (state, action: { payload: { file_id: string; current: string } }) => {
        if (!(action.payload.file_id in state)) {
          state[action.payload.file_id] = {
            history: [],
            current: "",
          };
        }
        state[action.payload.file_id].current = action.payload.current;
      },
    ),

    closeTerminal: create.reducer(
      (state, action: { payload: { file_id: string } }) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete state[action.payload.file_id];
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete Interpreters[action.payload.file_id];
      },
    ),

    restartTerminal: create.reducer(
      (state, action: { payload: { file_id: string } }) => {
        if (action.payload.file_id in state) {
          state[action.payload.file_id] = {
            history: [],
            current: "",
          };
          Interpreters[action.payload.file_id] = new Interpreter();
        }
      },
    ),
  }),

  selectors: {
    selectHistory: (state, file_id: string) => {
      if (file_id in state) {
        return state[file_id].history;
      } else {
        return [];
      }
    },
    selectCurrent: (state, file_id: string) => {
      if (file_id in state) {
        return state[file_id].current;
      } else {
        return "";
      }
    },
    selectInterpreter: (state, file_id: string) => Interpreters[file_id],
  },
});

export const { selectHistory, selectCurrent, selectInterpreter } =
  terminalSlice.selectors;

export const {
  initTerminal,
  updateHistory,
  setCurrent,
  closeTerminal,
  restartTerminal,
} = terminalSlice.actions;
