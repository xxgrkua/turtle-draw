import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import { persistor, store } from "./app/store.ts";
import "./index.css";

const root = document.getElementById("root") as HTMLElement;

// console.log(workbenchSlice);
// console.log(store);

// store.dispatch(login({ username: "ttt", password: "123456789" })).catch((e) => {
//   console.error(e);
// });

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
// store.dispatch(workbenchSlice.actions.addWorkspace({ name: "test" }));
// const workspaces = useSelector(selectAllWorkspaces);
