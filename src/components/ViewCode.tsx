"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const ViewCode = ({ code }: { code: string }) => {
  return (
    <CodeMirror
      value={code}
      theme="dark"
      extensions={[javascript({ jsx: true })]}
      defaultValue={code}
      readOnly
    />
  );
};

export default ViewCode;
