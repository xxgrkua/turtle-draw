import { Col, Layout, Row, theme } from "antd";
import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-scheme";

import Terminal from "../Terminal";
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
              mode="scheme"
              height="100%"
              width="100%"
              tabSize={2}
              onChange={setCode}
              onLoad={(editor) => {
                editor.focus();
              }}
              enableBasicAutocompletion={false}
              enableLiveAutocompletion={false}
              enableSnippets={false}
              setOptions={{
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
            <Terminal />
            <canvas></canvas>
          </Content>
        </Layout>
      </Col>
      <Col span={12}></Col>
    </Row>
  );
}

export default EditorArea;
