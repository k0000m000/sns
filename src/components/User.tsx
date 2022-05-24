import React, { useState } from "react";
import Link from "next/link";

import useRequest from "../libs/useRequest";
import { User } from "../types/common";
import { useSessionContext } from "../context/session";
import Posts from "./Posts";
import Users from "./Users";
import FollowButton from "./FollowButton";
import Error from "./Error";
import Spinner from "./Spinner";

interface Props {
  id: string;
}

const UserPage: React.FC<Props> = (props) => {
  const { data, error } = useRequest<User>({ url: `/api/users/${props.id}` });
  const { session } = useSessionContext();
  const [isFolloweesOpen, setIsfolloweesOpen] = useState<boolean>(false);
  const [isFollowersOpen, setIsfollowersOpen] = useState<boolean>(false);
  type Contents = "ownPosts" | "likePosts";
  const [contents, setContents] = useState<Contents>("ownPosts");
  if (error) {
    return (
      <div>
        <Error />
      </div>
    );
  }
  if (!data) {
    return <Spinner />;
  }

  const editUserDataButton = (
    <Link href="/userdata">
      <a>プロフィールを編集</a>
    </Link>
  );

  const headButton =
    data.id === session.id ? (
      editUserDataButton
    ) : (
      <FollowButton
        followeeId={data.id}
        isFollow={session.id in data.followers}
      />
    );

  const Contents: React.FC = () => {
    if (contents === "ownPosts") {
      return (
        <div>
          <h1>自分の投稿</h1>
          <Posts contents={contents} id={data.id} />
        </div>
      );
    } else {
      return (
        <div>
          <h1>いいね</h1>
          <Posts contents={contents} id={data.id} />
        </div>
      );
    }
  };

  const handleClickContentsTable = (contents: Contents) => {
    setContents(contents);
  };

  return (
    <div>
      <div>
        <div>{headButton}</div>
      </div>
      <h1>{data.name}</h1>
      <p>{`@${data.id}`}</p>
      <p>{data.text}</p>
      <div>
        <a
          onClick={() => setIsfolloweesOpen(true)}
        >{`${data.followees.length}フォロー中`}</a>
        <Users
          contents="followees"
          id={data.id}
          isOPen={isFolloweesOpen}
          onClickCloseButton={() => setIsfolloweesOpen(false)}
        />
        <a
          onClick={() => setIsfolloweesOpen(true)}
        >{`${data.followers.length}フォロー`}</a>
        <Users
          contents="followers"
          id={data.id}
          isOPen={isFollowersOpen}
          onClickCloseButton={() => setIsfollowersOpen(false)}
        />
      </div>
      <div className="contentsTable">
        <a onClick={() => handleClickContentsTable("ownPosts")}>ツイート</a>
        <a onClick={() => handleClickContentsTable("likePosts")}>いいね</a>
      </div>
      <Contents />
    </div>
  );
};
export default UserPage;
