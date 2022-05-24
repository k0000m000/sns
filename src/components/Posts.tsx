import React from "react";
import Link from "next/link";

import useRequest from "../libs/useRequest";
import { Post } from "../types/common";
import LikeButton from "./LikeButton";
import Error from "./Error";
import Spinner from "./Spinner";
import { useSessionContext } from "../context/session";

export type PostsContents = "ownPosts" | "likePosts";

interface Props {
  contents: PostsContents;
  id: string;
}

const Posts: React.FC<Props> = (props) => {
  const { data, error } = useRequest<Array<Post>>({
    url: `/api/users/${props.id}/${props.contents}`,
  });

  interface Props {
    post: Post;
  }
  const Post: React.FC<Props> = (props) => {
    const { session } = useSessionContext();
    return (
      <div>
        <div>
          <p>{props.post.userName}</p>
          <p>{props.post.userId}</p>
          <p>
            {`${props.post.date.getFullYear}/${props.post.date.getMonth}/${props.post.date.getDay}`}
          </p>
        </div>
        <div>
          <p>{props.post.text}</p>
        </div>
        <LikeButton
          isLike={session.id in props.post.likedUser}
          likeNumber={props.post.likedUser.length}
          postId={props.post.id}
        />
      </div>
    );
  };

  if (error) {
    alert(error);
    return <Error />;
  }
  if (!data) {
    return <Spinner />;
  }
  const posts = data.map((post) => (
    <li key={post.id}>
      <Link href={`/posts/${post.id}`}>
        <Post post={post}></Post>
      </Link>
    </li>
  ));
  return <ul>{posts}</ul>;
};

export default Posts;
