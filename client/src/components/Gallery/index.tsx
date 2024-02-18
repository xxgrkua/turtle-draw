import { Layout } from "antd";

import TopBar from "../TopBar";

import React from "react";
import GraphicCards from "../GraphicCards";
import "./style.css";

const Gallery: React.FC = function () {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TopBar />
      <GraphicCards />
    </Layout>
  );
};

export default Gallery;
