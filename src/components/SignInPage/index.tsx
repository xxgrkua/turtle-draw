import { Layout } from "antd";

import SignIn from "../SignIn";
import "./style.css";

const { Content } = Layout;

const SignInPage = () => {
  return (
    <Layout>
      <Content className="login-background">
        <SignIn />
      </Content>
    </Layout>
  );
};

export default SignInPage;
