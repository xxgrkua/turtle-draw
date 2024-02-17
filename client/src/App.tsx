import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import ErrorPage from "./components/ErrorPage";
import Gallery from "./components/Gallery";
import Main from "./components/Main";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import { init } from "./features/user";

import "./App.css";

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const initStatus = useAppSelector((state) => state.user.initState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initStatus === "idle") {
      dispatch(init()).catch(() => {});
    }
  }, [initStatus, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Main isLoggedIn={isLoggedIn} />}
          errorElement={<ErrorPage />}
        />
        <Route path="gallery/" element={<Gallery isLoggedIn={isLoggedIn} />} />
        {isLoggedIn ? (
          <Route path="login/" element={<Navigate to="/" replace />} />
        ) : (
          <Route
            path="login/"
            element={<SignInPage setLoggedIn={setLoggedIn} />}
          />
        )}
        {isLoggedIn ? (
          <Route path="register" element={<Navigate to={"/"} replace />} />
        ) : (
          <Route path="register" element={<SignUpPage />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
