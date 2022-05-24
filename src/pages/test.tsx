import { useRouter } from "next/router";
import React, { useState } from "react";

import { useSessionContext, SessionProvider } from "../context/session";
import { InputAreaProps } from "../types/client";
import InputArea from "../components/InputArea";

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
const Test: React.FC = () => {
  const { session, setSession } = useSessionContext();
  const [name, setName] = useState<string>("a");
  const handleClick = () => {
    alert(setSession);
    setSession({ isLogined: true, id: "A" });
    alert(session.isLogined);
  };
  const router = useRouter();
  const item: InputAreaProps = {
    value: name,
    text: "",
    setState: setName,
    type: "text",
  };
  return (
    <div>
      <InputAreas inputItems={[item]}></InputAreas>
      <a onClick={handleClick}>bo</a>
    </div>
  );
};

export default Test;
