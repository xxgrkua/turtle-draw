import React from "react";

import { scheme_eval_wasm } from "rust-scheme";

const Terminal: React.FC = () => {
  const [input, setInput] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");

  let a = scheme_eval_wasm();
  console.log(a);
  console.log(a("(define a 2)"));
  console.log(a("(+ a 3)"));
  // console.log(a("b"));
  return <p></p>;
};

export default Terminal;
