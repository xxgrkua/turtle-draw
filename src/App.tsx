import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import ErrorPage from "./components/ErrorPage";
import Gallery from "./components/Gallery";
import Main from "./components/Main";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";

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
  {
    path: "signin/",
    element: <SignInPage />,
  },
  {
    path: "signup/",
    element: <SignUpPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
