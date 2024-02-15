import React from "react";

import { getInterpreter } from "rust-scheme";

const Terminal: React.FC = () => {
  const [input, setInput] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");

  let interpret = getInterpreter();
  console.log(interpret);
  console.log(interpret("(define a 2)"));
  console.log(interpret("(+ a 3)"));
  // console.log(a("b"));
  return <p></p>;
};

export default Terminal;
