import { Layout } from "antd";

import SignUp from "../SignUp";
import "./style.css";

const { Content } = Layout;

const SignUpPage = () => {
  return (
    <Layout>
      <Content className="login-background">
        <SignUp />
      </Content>
    </Layout>
  );
};

export default SignUpPage;
