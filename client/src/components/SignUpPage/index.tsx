import { Layout } from "antd";

import React from "react";
import SignUp from "../SignUp";
import "./style.css";

const { Content } = Layout;

const SignUpPage: React.FC = () => {
  return (
    <Layout>
      <Content className="login-background">
        <SignUp />
      </Content>
    </Layout>
  );
};

export default SignUpPage;
