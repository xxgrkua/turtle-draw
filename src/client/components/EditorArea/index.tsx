import { Col, Layout, Row, theme } from "antd";
import React from "react";
import AceEditor from "react-ace";

import "./style.css";

const { Content } = Layout;

function EditorArea(): React.ReactElement {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [code, setCode] = React.useState("");

  return (
    <Row gutter={8}>
      <Col span={12}>
        <Layout>
          <Content
            className="main-editor editor-history"
            style={{
              background: colorBgContainer,
            }}
          >
            <AceEditor
              value={code}
              // mode="java"
              height="100%"
              width="100%"
              tabSize={2}
              onChange={setCode}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
              }}
            />
          </Content>
        </Layout>
      </Col>
      <Col span={12}>
        <Layout>
          <Content
            className="main-editor editor-canvas"
            style={{
              background: colorBgContainer,
            }}
          >
            {/* {code} */}
            <canvas></canvas>
          </Content>
        </Layout>
      </Col>
      <Col span={12}></Col>
    </Row>
  );
}

export default EditorArea;
