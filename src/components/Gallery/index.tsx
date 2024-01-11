import { Layout } from "antd";

import AppBar from "../AppBar";

import React from "react";
import GraphicCards from "../GraphicCards";
import "./style.css";

const Gallery: React.FC = function () {
  return (
    <Layout>
      <AppBar />
      <GraphicCards />
    </Layout>
  );
};

export default Gallery;
