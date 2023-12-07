import { Layout } from "antd";

import AppBar from "../AppBar";

import "./style.css";
import GraphicCards from "../GraphicCards";

function Gallery() {
  return (
    <Layout>
      <AppBar />
      <GraphicCards />
    </Layout>
  );
}

export default Gallery;
