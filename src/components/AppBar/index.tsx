import { Button, Layout } from "antd";

import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const { Header } = Layout;

const AppBar: React.FC = function () {
  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <h1 className="title">Turtle Draw</h1>
      {/* <Typography>
        <Title>Turtle Draw</Title>
      </Typography> */}
      {/* <div className="demo-logo" /> */}
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
      <Button type="link">
        <Link to="/">Editor</Link>
      </Button>
      <Button type="link">
        <Link to="/gallery">Gallery</Link>
      </Button>
      <Button type="link">
        <Link to="/signin">Sign in</Link>
      </Button>
      <Button type="link">
        <Link to="/signup">Sign up</Link>
      </Button>
    </Header>
  );
};

export default AppBar;
