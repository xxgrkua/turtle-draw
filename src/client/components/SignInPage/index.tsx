import { Layout } from "antd";

import React from "react";
import SignIn from "../SignIn";
import "./style.css";

const { Content } = Layout;

interface SignInPageProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInPage: React.FC<SignInPageProps> = ({ setLoggedIn }) => {
  return (
    <Layout>
      <Content className="login-background">
        <SignIn setLoggedIn={setLoggedIn} />
      </Content>
    </Layout>
  );
};

export default SignInPage;
