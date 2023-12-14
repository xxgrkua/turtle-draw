import { RightOutlined, SendOutlined } from "@ant-design/icons";
import { Col, Input, Layout, Row, Typography, theme } from "antd";
import React, { useState } from "react";

import "./style.css";

const { Content } = Layout;

const { Paragraph } = Typography;

function EditorArea() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const newHistory = [...history];
    newHistory.push(inputValue);
    setHistory(newHistory);
    setInputValue("");
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === "Enter") {
      const newHistory = [...history];
      newHistory.push(inputValue);
      setHistory(newHistory);
      setInputValue("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
          <Layout>
            <Content
              className="main-editor editor-history"
              style={{
                background: colorBgContainer,
              }}
            >
              <Typography>
                {history.map((value) => {
                  return <Paragraph>{value}</Paragraph>;
                })}
              </Typography>
            </Content>
          </Layout>
        </Col>
        <Col span={12}>
          <Layout>
            <Content
              className="main-editor editor-draw"
              style={{
                background: colorBgContainer,
              }}
            >
              Canvas
              <canvas></canvas>
            </Content>
          </Layout>
        </Col>
      </Row>
      <Layout className="input-area">
        <Input
          className="editor-input"
          placeholder="Press 'Enter' to draw"
          prefix={<RightOutlined />}
          suffix={<SendOutlined onClick={() => handleSend()} />}
          size="large"
          value={inputValue}
          onChange={(event) => handleChange(event)}
          onKeyDown={(event) => handleEnter(event)}
        />
      </Layout>
    </div>
  );
}

export default EditorArea;
