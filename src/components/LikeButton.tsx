import React from "react";
import axios from "axios";

import { mutate } from "swr";
import { useSessionContext } from "../context/session";

interface Props {
  likeNumber: number;
  isLike: boolean;
  postId: string;
}

const LikeButton: React.FC<Props> = (props) => {
  const { session } = useSessionContext();

  const heartIcon = (
    <svg
      version="1.1"
      id="icons"
      x="0px"
      y="0px"
      width="44px"
      height="42px"
      viewBox="0 0 44 42"
      enableBackground="new 0 0 44 42"
    >
      <path
        fill={props.isLike ? "3ff1493" : "none"}
        stroke={props.isLike ? "3ff1493" : "#000000"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="
		M3.629,18.444l17.809,21.282c0.307,0.367,0.809,0.362,1.112,0l17.809-21.282l-0.711,0.91c1.049-1.311,1.799-2.892,2.143-4.628
		C41.928,14.031,42,13.312,42,12.574c0-5.835-4.519-10.566-10.093-10.566c-4.599,0-8.479,3.22-9.697,7.623l-0.42-0.008
		C20.573,5.22,16.692,2,12.093,2C6.519,2,2,6.73,2,12.566c0,0.737,0.072,1.457,0.209,2.152c0.343,1.737,1.094,3.318,2.143,4.628"
      />
    </svg>
  );

  const handleClick = () => {
    props.isLike
      ? axios.delete(`/api/users/${session.id}/likes/${props.postId}`)
      : axios.post(`/api/users/${session.id}/likes`, {
          id: props.postId,
        });
    mutate(`/api/users/${props.postId}`);
  };
  return (
    <a onClick={handleClick}>
      <div>{heartIcon}</div>
      <p>{props.likeNumber}</p>
    </a>
  );
};

export default LikeButton;
