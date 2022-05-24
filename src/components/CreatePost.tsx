import react, { useState } from "react";
import axios from "axios";
import { v4 as uuid4 } from "uuid";

import { useSessionContext } from "../context/session";
import { PostBaseData } from "../types/common";
import InputArea from "./InputArea";
import CloseButton from "./CloseButton";

interface Props {
  isOpen: boolean;
  onClickOpenButton: React.MouseEventHandler<HTMLAnchorElement>;
  onClickCloseButton: React.MouseEventHandler<HTMLAnchorElement>;
  postSuccess: react.Dispatch<react.SetStateAction<string>>;
}

const CreatePost: React.FC<Props> = (props) => {
  const [text, setText] = useState<string>("");
  const { session } = useSessionContext();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const post: PostBaseData = {
      id: uuid4(),
      userId: session.id,
      date: new Date(),
      text,
    };
    axios.post("/api/post", { post }).then((res) => {
      if (res.status === 201) {
        props.postSuccess;
      }
    });
  };

  return (
    <div>
      {props.isOpen ? (
        <div>
          <CloseButton onClick={props.onClickCloseButton} />
          <form onSubmit={onSubmit}>
            <InputArea
              text="投稿"
              value="投稿内容を入力してください"
              type="textarea"
              setState={setText}
            />
            <input value="投稿" type="submit" />
          </form>
        </div>
      ) : (
        <a onClick={props.onClickOpenButton}>投稿を作成</a>
      )}
    </div>
  );
};

export default CreatePost;
