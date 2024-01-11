import { Card, Col, Row } from "antd";

import React from "react";
import "./style.css";

const GraphicCards: React.FC = function () {
  return (
    <Row>
      <Col xs={6}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
      <Col sm={6}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
      <Col sm={6}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
      <Col sm={6}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
    </Row>
  );
};

export default GraphicCards;
