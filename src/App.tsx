import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Main from "./components/Main";
import ErrorPage from "./components/ErrorPage";
import Gallery from "./components/Gallery";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
  },
  {
    path: "gallery/",
    element: <Gallery />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
