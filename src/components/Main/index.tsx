import { Layout } from "antd";

import AppBar from "../AppBar";
import SideBar from "../SideBar";
import Tab from "../Tab";

import "./style.css";

function Main() {
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
}

export default Main;
