import { User, Post } from "./common";

export type ValueOf<T> = T[keyof T];
export type OptionalKeys<T> = { [K in keyof T]?: T[K] };
export type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : T extends User
  ? "user"
  : T extends Post
  ? "post"
  : T extends Array<User>
  ? "userList"
  : T extends Array<Post>
  ? "postList"
  : "object";
