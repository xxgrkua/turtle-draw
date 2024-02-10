import { Card, Flex } from "antd";

import React from "react";
import "./style.css";

const { Meta } = Card;

const GraphicCards: React.FC = function () {
  return (
    <div style={{ padding: 50 }}>
      <Flex wrap="wrap" align="center" justify="space-evenly">
        <Card
          hoverable
          style={{ width: 300 }}
          cover={<img alt="img" src="images/2222.png" />}
        >
          <Meta title="Sierpinski triangle" description="@Tanaka" />
        </Card>
        <Card
          hoverable
          style={{ width: 300 }}
          cover={<img alt="img" src="images/3333.png" />}
        >
          <Meta title="Koch curve" description="@Takahashi" />
        </Card>
        {/* <Card hoverable style={{ width: 300 }}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card hoverable style={{ width: 300 }}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card> */}
      </Flex>
    </div>
  );
};

export default GraphicCards;
