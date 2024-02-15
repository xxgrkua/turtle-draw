import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./app/store.ts";
import { workbenchSlice } from "./features/workspace/index.ts";
import "./index.css";

const root = document.getElementById("root") as HTMLElement;

console.log(workbenchSlice);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
