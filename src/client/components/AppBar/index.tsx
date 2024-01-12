import { Button, Layout } from "antd";

import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const { Header } = Layout;

interface AppBarProps {
  isLoggedIn: boolean;
}

const AppBar: React.FC<AppBarProps> = function ({ isLoggedIn }) {
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
      {isLoggedIn ? (
        <Button></Button>
      ) : (
        <React.Fragment>
          <Button type="link">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button type="link">
            <Link to="/register">Sign up</Link>
          </Button>
        </React.Fragment>
      )}
    </Header>
  );
};

export default AppBar;
