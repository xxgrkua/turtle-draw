import { Layout } from "antd";

import AppBar from "../AppBar";
import SideBar from "../SideBar";
import Tab from "../Tab";

import React from "react";
import "./style.css";

const Main: React.FC = function () {
  return (
    <Layout>
      <AppBar />
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
