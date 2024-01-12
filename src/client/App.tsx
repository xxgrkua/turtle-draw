import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import ErrorPage from "./components/ErrorPage";
import Gallery from "./components/Gallery";
import Main from "./components/Main";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main isLoggedIn={isLoggedIn} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "gallery/",
      element: <Gallery />,
    },
    {
      path: "signin/",
      element: <SignInPage setLoggedIn={setLoggedIn} />,
    },
    {
      path: "signup/",
      element: <SignUpPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
