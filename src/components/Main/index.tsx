import { Layout } from "antd";

import AppBar from "../AppBar";
import SideBar from "../SideBar";
import TabBar from "../TabBar";

import "./style.css";

function Main() {
  return (
    <Layout>
      <AppBar />
      <Layout>
        <SideBar />
        <Layout>
          <TabBar />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Main;
