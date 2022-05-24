"use strict";
import { promisify } from "util";
import type { RunResult, sqlite3 as Sqlite3 } from "sqlite3";

import {
  User,
  UserBaseData,
  Post,
  PostBaseData,
  Follow,
  Like,
} from "../src/types/common";
import { OptionalKeys } from "../src/types/utility";

interface UserSQLite {
  id: string;
  name: string;
  password: string;
  text: string;
}

interface PostSQLite {
  id: string;
  user: string;
  text: string;
  date: string;
}

type SQLiteArgs = [sql: string, ...params: any[]];
type PromiseDbGet = <T>(arg: string, arg2?: any) => Promise<T>;
type PromiseDbAll = <T>(arg: string, arg2?: any) => Promise<T>;

const sqlite3: Sqlite3 =
  process.env.NODE_ENV === "production"
    ? require("sqlite3")
    : require("sqlite3").verbose();
const db = new sqlite3.Database("./sqlite/database.sqlite");

const dbGet: PromiseDbGet = promisify(db.get.bind(db));
const dbRun = function (...args: SQLiteArgs) {
  return new Promise<RunResult>((resolve, reject) =>
    db.run.apply(db, [
      ...args,
      function (this: RunResult, err: any) {
        err ? reject(err) : resolve(this);
      },
    ])
  );
};
const dbAll: PromiseDbAll = promisify(db.all.bind(db));

type Fetch<T> = (id: string) => Promise<T | null>;
type FetchTimeline<T> = (id: string) => Promise<Array<T | null>>;
type FetchArray<T> = (idList: Array<string>) => Promise<Array<T | null>>;
type Create<T> = (object: T) => Promise<void>;
type Update<T> = (
  id: string,
  update: OptionalKeys<T>
) => Promise<string | null>;
type Remove = (id: string) => Promise<void>;

type rowToObject<T, U> = (row: T) => Promise<U | null>;

export const rowToUser: rowToObject<UserSQLite, User> = async (row) => {
  const posts = await dbAll<Array<string>>(
    "SELECT * FROM posts WHERE user = ?",
    row.id
  );
  const likePosts = await dbAll<Array<string>>(
    "SELECT * FROM posts WHERE user = ?",
    row.id
  );
  const followers = await dbAll<Array<string>>(
    "SELECT * FROM follows WHERE followee = ?",
    row.id
  );
  const followees = await dbAll<Array<string>>(
    "SELECT * FROM follows WHERE follower = ?",
    row.id
  );
  return {
    ...row,
    posts,
    likePosts,
    followers,
    followees,
  };
};

const fetchUser: Fetch<User> = async (id) => {
  const rowUser = await dbGet<UserSQLite>(
    "SELECT * FROM users WHERE id = ?",
    `${id}`
  );
  if (!rowUser) {
    return null;
  }
  return rowToUser(rowUser);
};

const createUser: Create<UserBaseData> = async (user) => {
  await dbRun(
    "INSERT INTO users VALUES (?, ?, ?, ?)",
    user.id,
    user.name,
    user.password,
    user.text
  );
};

const updateUser: Update<User> = (id, update) => {
  const setColumns = [];
  const values = [];
  const columns = ["name", "password", "text"] as const;
  for (const column of columns) {
    if (column in update) {
      setColumns.push(` ${column} = ? `);
      values.push(update[column]);
    }
  }
  values.push(id);
  return dbRun(
    `UPDATE users SET ${setColumns.join()} WHERE id = ?`,
    values
  ).then(({ changes }) => (changes === 1 ? id : null));
};

const removeUser: Remove = async (id) => {
  await dbRun("BEGIN TRANSACTION");
  try {
    Promise.all([
      dbRun("DELETE FROM users WHERE id = ?", id),
      dbRun("DELETE FROM posts WHERE userId = ?", id),
      dbRun("DELETE FROM follows WHERE followee = ?", id),
      dbRun("DELETE FROM follows WHERE follower = ?", id),
      dbRun("DELETE FROM posts WHERE user = ?", id),
    ]);
  } catch (err) {
    dbRun("ROLLBACK TRSNSACTION");
    return;
  }
  dbRun("COMMIT TRANSACTION");
};

const rowToPost: rowToObject<PostSQLite, Post> = async (row) => {
  const user = await dbGet<UserSQLite>(
    "SELECT * FROM users WHERE id = ?",
    `${row.user}`
  );
  if (!user) {
    return null;
  }
  const likedUser = await dbAll<Array<string>>(
    "SELECT post FROM likes where post = ?",
    `${row.id}`
  );
  return {
    ...row,
    userId: row.user,
    userName: user.name,
    date: new Date(row.date),
    likedUser,
    user: undefined,
  };
};

const fetchPost: Fetch<Post> = async (id) => {
  const rowPost = await dbGet<PostSQLite>(
    "SELECT * FROM posts WHERE id = ?",
    `${id}`
  );
  if (!rowPost) {
    return null;
  }
  return rowToPost(rowPost);
};

const fetchTimeline: FetchTimeline<Post> = async (id) => {
  const user = await fetchUser(id);
  if (!user) {
    return [];
  }
  const users = user.followees;
  users.push(id);
  const rows = await dbAll<Array<PostSQLite>>(
    "SELECT * FROM posts WHERE user in ?",
    `(${users.join(", ")} )`
  );
  return Promise.all(rows.map(rowToPost));
};

const fetchPosts: FetchArray<Post> = async (idList) => {
  if (idList.length === 0) {
    return [];
  }
  const rows = await dbAll<Array<PostSQLite>>(
    "SELECT * FROM posts WHERE id in ?",
    `(${idList.join(", ")})`
  );
  return Promise.all(rows.map(rowToPost));
};

const createPost = async (post: PostBaseData) => {
  await dbRun(
    "INSERT INTO posts VALUES (?, ?, ?, ?)",
    post.id,
    post.userId,
    post.text,
    post.date.toString()
  );
};

const updatePost: Update<Post> = (id, update) => {
  const setColumns = [];
  const values = [];
  const columns = ["text"] as const;
  for (const column of columns) {
    if (column in update) {
      setColumns.push(` ${column} = ? `);
      values.push(update[column]);
    }
  }
  values.push(id);
  return dbRun(
    `UPDATE posts SET ${setColumns.join()} WHERE id = ?`,
    values
  ).then(({ changes }) => (changes === 1 ? id : null));
};

const removePost: Remove = async (id) => {
  await dbRun("BEGIN TRANSACTION");
  try {
    Promise.all([
      dbRun("DELETE FROM likes WHERE post = ?", id),
      dbRun("DELETE FROM posts WHERE id = ?", id),
    ]);
  } catch {
    dbRun("ROLLBACK TRSNSACTION");
    return;
  }
  dbRun("COMMIT TRANSACTION");
};

const createFollow: Create<Follow> = async (follow) => {
  await dbRun(
    "INSERT INTO follows VALUES (?, ?, ?)",
    follow.id,
    follow.followee,
    follow.follower
  );
};

const removeFollow: Remove = async (id) => {
  dbRun("DELETE FROM follows WHERE id = ?", id);
};

const createLike: Create<Like> = async (like) => {
  await dbRun(
    "INSERT INTO likes VALUES (?, ?, ?)",
    like.id,
    like.post,
    like.user
  );
};

const removeLike: Remove = async (id) => {
  dbRun("DELETE FROM likes WHERE id = ?", id);
};

const exportObject = {
  fetchUser,
  createUser,
  updateUser,
  removeUser,
  fetchPost,
  fetchPosts,
  fetchTimeline,
  createPost,
  updatePost,
  removePost,
  createFollow,
  removeFollow,
  createLike,
  removeLike,
};

export default exportObject;
