import react from "react";

import { User, Post, DataType } from "./common";
import { TypeName } from "./utility";

export type FetchFunction<T extends DataType> = (id: string) => {
  P: T | undefined;
  error: any;
};

export type FetchUser = (id: string) => {
  user: User | undefined;
  error: any;
};

export type FetchUserList = (id: string) => {
  userList: Array<User> | undefined;
  error: any;
};

export type FetchPostList = (id: string) => {
  postList: Array<Post> | undefined;
  error: any;
};

export interface InputAreaProps {
  text: string;
  value: string;
  setState: react.Dispatch<react.SetStateAction<string>>;
  type: "text" | "textarea" | "password";
}
