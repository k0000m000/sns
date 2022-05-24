import React from "react";

import { InputAreaProps } from "../types/client";
import InputArea from "./InputArea";

interface Props {
  inputItems: Array<InputAreaProps>;
}

const InputAreas: React.FC<Props> = (props) => {
  const inputAreas = props.inputItems.map((inputItem, index) => (
    <li key={index}>
      <InputArea
        text={inputItem.text}
        value={inputItem.value}
        setState={inputItem.setState}
        type={inputItem.type}
      />
    </li>
  ));
  return <ul>{inputAreas}</ul>;
};

export default InputAreas;
