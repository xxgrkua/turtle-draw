import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { ConfigProvider, Space, theme } from "antd";
import enUS from "antd/locale/en_US";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./style.css";

interface SignInProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<SignInProps> = ({ setLoggedIn }) => {
  const { token } = theme.useToken();

  const submit = function () {
    axios
      .post("/user/login", {
        login_name: "ian",
        password: "weak",
      })
      .then(() => {
        setLoggedIn(true);
      })
      .catch(() => {});
  };

  const submitter = {
    onSubmit: submit,
    searchConfig: {
      submitText: "Sign in",
    },
  };

  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <ConfigProvider locale={enUS}>
      <LoginForm
        title={
          <Link to="/" style={{ color: token.colorText }}>
            TurtleDraw
          </Link>
        }
        subTitle="Sign in to TurtleDraw"
        submitter={submitter}
        actions={
          // TODO: add sns account login
          <Space>
            Don`&apos`t have an account yet? <Link to="/signup">Sign up</Link>
          </Space>
        }
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder="Username"
          rules={[
            {
              required: true,
              message: "Please input your Username",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder="Password"
          rules={[
            {
              required: true,
              message: "Please input your Password",
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox
            noStyle
            name="autoLogin"
            fieldProps={{ checked: checked, onChange: handleChange }}
          >
            Remember me
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            Forgot password?
          </a>
        </div>
      </LoginForm>
    </ConfigProvider>
  );
};

export default SignIn;
