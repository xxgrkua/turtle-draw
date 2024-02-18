import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import ErrorPage from "./components/ErrorPage";
import Gallery from "./components/Gallery";
import LoginRegister from "./components/LoginRegister";
import Main from "./components/Main";
import {
  init,
  resetState,
  selectUserInfo,
  selectUserInitState,
} from "./features/user";

const App: React.FC = () => {
  const userInfo = useAppSelector(selectUserInfo);
  const initState = useAppSelector(selectUserInitState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initState === "idle") {
      dispatch(init()).catch((error) => {
        console.log(error);
      });
    }
  }, [dispatch, initState, userInfo]);
  useEffect(() => {
    dispatch(resetState());
  }, [userInfo, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/" element={<Main />} errorElement={<ErrorPage />} />
        {userInfo ? (
          <Route path="/login" element={<Navigate to="/" replace />} />
        ) : (
          <Route path="/login" element={<LoginRegister type="login" />} />
        )}
        {userInfo ? (
          <Route path="/register" element={<Navigate to={"/"} replace />} />
        ) : (
          <Route path="/register" element={<LoginRegister type="register" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
