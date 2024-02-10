import { Layout } from "antd";
import React from "react";
import AppBar from "../AppBar";
import SideBar from "../SideBar";
import Tab from "../Tab";
import "./style.css";

interface MainProps {
  isLoggedIn: boolean;
}

const Main: React.FC<MainProps> = function ({ isLoggedIn }) {
  return (
    <Layout>
      <AppBar isLoggedIn={isLoggedIn} />
      <Layout>
        <SideBar />
        <Layout>
          <Tab />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
