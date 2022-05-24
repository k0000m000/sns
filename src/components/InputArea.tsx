import { InputAreaProps } from "../types/client";

type Props = InputAreaProps;

const InputArea: React.FC<Props> = (props) => {
  return (
    <div>
      <p>{props.text}</p>
      <input
        value={props.value}
        onChange={(event) => props.setState(event.target.value)}
        type={props.type}
      />
    </div>
  );
};

export default InputArea;
