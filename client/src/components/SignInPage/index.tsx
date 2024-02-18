import { Layout } from "antd";

import React from "react";
import SignIn from "../SignIn";
import "./style.css";

const { Content } = Layout;

const SignInPage: React.FC = () => {
  return (
    <Layout>
      <Content className="login-background">
        <SignIn />
      </Content>
    </Layout>
  );
};

export default SignInPage;
