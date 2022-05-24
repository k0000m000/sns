import react, { useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosResponse, AxiosError } from "axios";

import { UserBaseData } from "../types/common";
import { InputAreaProps } from "../types/client";
import InputAreas from "../components/InputAreas";

const Regist: react.FC = () => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordForConfimation, setPasswordForConfimation] =
    useState<string>("");
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isNotPassedPasswordChecking, setIsNotPassedPasswordChecking] =
    useState<boolean>(false);
  const [isNotPassedNotNullChecking, setIsNotPassedNotNullChecking] =
    useState<boolean>(false);
  const [isUsedID, setIsUsedId] = useState<boolean>(false);
  const router = useRouter();

  const registItems: Array<InputAreaProps> = [
    { text: "名前*", value: name, setState: setName, type: "text" },
    {
      text: "パスワード*",
      value: password,
      setState: setPassword,
      type: "password",
    },
    {
      text: "パスワード（確認用）*",
      value: passwordForConfimation,
      setState: setPasswordForConfimation,
      type: "password",
    },
    { text: "UserID*", value: id, setState: setId, type: "text" },
    { text: "紹介文", value: text, setState: setText, type: "textarea" },
  ];

  let nullRegistItems: Array<string> = [];

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsNotPassedPasswordChecking(false);
    setIsNotPassedNotNullChecking(false);
    nullRegistItems = [];
    if (password !== passwordForConfimation) {
      setIsNotPassedPasswordChecking(true);
    }
    const user: UserBaseData = { name, password, id, text };
    Object.entries(user).forEach(([key, value]) => {
      if (!value) {
        setIsNotPassedNotNullChecking(true);
        nullRegistItems.push(key);
      }
    });
    if (isNotPassedPasswordChecking || isNotPassedNotNullChecking) {
      return;
    }
    axios
      .post("/api/regist", { user })
      .then((res: AxiosResponse) => {
        if (res.status === 201) {
          router.push("/test");
        }
      })
      .catch((err: AxiosError) => {
        if (err.response && err.response.status === 409) {
          setIsUsedId(true);
        }
      });
  };

  const messageIdUSed = isUsedID ? "このIDは使用されています。" : "bar";
  const messageNotPassedPasswordChecking = isNotPassedPasswordChecking
    ? "パスワードが確認用と異なります"
    : "";
  return (
    <div>
      <p>{messageIdUSed}</p>
      <p>{messageNotPassedPasswordChecking}</p>
      <h1>ユーザー登録</h1>
      <form onSubmit={onSubmit}>
        <InputAreas inputItems={registItems} />
        <input value="登録" type="submit" />
      </form>
    </div>
  );
};

export default Regist;
