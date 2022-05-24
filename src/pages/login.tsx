import react, { useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosResponse, AxiosError } from "axios";

import { InputAreaProps } from "../types/client";
import InputAreas from "../components/InputAreas";

const Login: react.FC = () => {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isIdOrPasswordWrong, setIsIdOrPasswordWrong] =
    useState<boolean>(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("/api/login", { id, password })
      .then((res: AxiosResponse) => {
        if (res.status == 200) {
          localStorage.setItem("id", id);
          router.push(`/home`);
        }
      })
      .catch((err: AxiosError) => {
        if (err.response && err.response.status == 409) {
          setIsIdOrPasswordWrong(true);
        }
      });
  };

  const messageIdOrPasswordWrong = isIdOrPasswordWrong
    ? "IDもしくはパスワードが間違っています"
    : "";

  const loginItems: Array<InputAreaProps> = [
    { text: "ID", value: id, setState: setId, type: "text" },
    {
      text: "パスワード",
      value: password,
      setState: setPassword,
      type: "password",
    },
  ];

  return (
    <div>
      <p>{messageIdOrPasswordWrong}</p>
      <h1>ログインページ</h1>
      <form onSubmit={onSubmit}>
        <InputAreas inputItems={loginItems} />
        <input type="submit" value="ログイン" />
      </form>
    </div>
  );
};

export default Login;
