import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.tsx";
import { store } from "./app/store.ts";
import { apiSlice } from "./features/api/index.ts";
import { incrementIfOdd } from "./features/counter/counterSlice.ts";
import { login } from "./features/user/index.ts";
import { workbenchSlice } from "./features/workspace/index.ts";
import "./index.css";

const root = document.getElementById("root") as HTMLElement;

// console.log(workbenchSlice);
// console.log(store);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
store.dispatch(workbenchSlice.actions.addWorkspace({ name: "test" }));
console.log(store.getState());
console.log(apiSlice);
store.dispatch(incrementIfOdd(2));
store.dispatch(login({ username: "ttt", password: "123456789" })).catch((e) => {
  console.error(e);
});
store
  .dispatch(login({ username: "ttt", password: "123456789dfdfd" }))
  .catch((e) => {
    console.log(e);
  });
// const workspaces = useSelector(selectAllWorkspaces);
