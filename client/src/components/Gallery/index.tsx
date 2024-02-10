import { Layout } from "antd";

import AppBar from "../AppBar";

import React from "react";
import GraphicCards from "../GraphicCards";
import "./style.css";

interface GalleryProps {
  isLoggedIn: boolean;
}

const Gallery: React.FC<GalleryProps> = function ({ isLoggedIn }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppBar isLoggedIn={isLoggedIn} />
      <GraphicCards />
    </Layout>
  );
};

export default Gallery;
