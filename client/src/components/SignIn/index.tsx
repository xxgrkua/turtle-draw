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

const SignIn: React.FC = () => {
  const { token } = theme.useToken();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(true);

  const handleChecked = () => {
    setChecked(!checked);
  };

  const submit = function () {
    axios
      .post("/api/user/login", {
        username: loginName,
        password: password,
      })
      .then(() => {
        // setLoggedIn(true);
      })
      .catch(() => {});
  };

  const submitter = {
    onSubmit: submit,
    searchConfig: {
      submitText: "Sign in",
    },
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
            value: loginName,
            onChange: (event) => {
              setLoginName(event.currentTarget.value);
            },
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
            value: password,
            onChange: (event) => {
              setPassword(event.currentTarget.value);
            },
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
            fieldProps={{ checked: checked, onChange: handleChecked }}
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
