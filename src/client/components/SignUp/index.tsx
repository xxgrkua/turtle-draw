import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { ConfigProvider, Space, theme } from "antd";
import enUS from "antd/locale/en_US";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const SignUp: React.FC = () => {
  const { token } = theme.useToken();
  const submitter = {
    searchConfig: {
      submitText: "Sign up",
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
        subTitle="Sign up to TurtleDraw"
        submitter={submitter}
        actions={
          // TODO: add sns account login
          <Space>
            Already have an account? <Link to="/signin">Sign in</Link>
          </Space>
        }
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder={"Username"}
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
            strengthText:
              "Password should contain numbers, letters and special characters, at least 8 characters long.",

            statusRender: (value) => {
              const getStatus = () => {
                if (value && value.length > 12) {
                  return "ok";
                }
                if (value && value.length > 6) {
                  return "pass";
                }
                return "poor";
              };
              const status = getStatus();
              if (status === "pass") {
                return (
                  <div style={{ color: token.colorWarning }}>
                    Strength: Medium
                  </div>
                );
              }
              if (status === "ok") {
                return (
                  <div style={{ color: token.colorSuccess }}>
                    Strength: Strong
                  </div>
                );
              }
              return (
                <div style={{ color: token.colorError }}>Strength: Weak</div>
              );
            },
          }}
          placeholder={"Password"}
          rules={[
            {
              required: true,
              message: "Please input your Password",
            },
          ]}
        />
      </LoginForm>
    </ConfigProvider>
  );
};

export default SignUp;
