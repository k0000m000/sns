export interface UserBaseData {
  id: string;
  name: string;
  password: string;
  text: string;
}

export interface User extends UserBaseData {
  posts: Array<string>;
  followers: Array<string>;
  followees: Array<string>;
  likePosts: Array<string>;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  date: Date;
  userName: string;
  likedUser: Array<string>;
}

export type PostBaseData = Omit<Post, "userName" | "likedUser">;

export interface Follow {
  id: string;
  followee: string;
  follower: string;
}

export interface Like {
  id: string;
  post: string;
  user: string;
}

export type DataType = User | Post | Array<User> | Array<Post>;
