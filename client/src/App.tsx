import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import ErrorPage from "./components/ErrorPage";
import Gallery from "./components/Gallery";
import Main from "./components/Main";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import { init, selectUserInfo, selectUserInitState } from "./features/user";

import "./App.css";

const App: React.FC = () => {
  const initStatus = useAppSelector(selectUserInitState);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initStatus === "idle") {
      dispatch(init()).catch(() => {});
    }
  }, [initStatus, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} errorElement={<ErrorPage />} />
        <Route path="gallery/" element={<Gallery />} />
        {userInfo ? (
          <Route path="login/" element={<Navigate to="/" replace />} />
        ) : (
          <Route path="login/" element={<SignInPage />} />
        )}
        {userInfo ? (
          <Route path="register" element={<Navigate to={"/"} replace />} />
        ) : (
          <Route path="register" element={<SignUpPage />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
