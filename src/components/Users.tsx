import React from "react";
import Link from "next/link";
import useRequest from "../libs/useRequest";
import { User } from "../types/common";
import { useSessionContext } from "../context/session";
import FollowButton from "./FollowButton";
import CloseButton from "./CloseButton";
import Error from "./Error";
import Spinner from "./Spinner";
import styled from "styled-components";

type UsersContents = "followees" | "followers";

interface Props {
  contents: UsersContents;
  id: string;
  isOPen: boolean;
  onClickCloseButton: React.MouseEventHandler<HTMLAnchorElement>;
}

const Users: React.FC<Props> = (props) => {
  const { data, error } = useRequest<Array<User>>({
    url: `/api/users/${props.id}/${props.contents}`,
  });

  interface Props {
    user: User;
  }

  const User: React.FC<Props> = (props) => {
    const { session } = useSessionContext();

    return (
      <Link href={`/users/${props.user.id}`}>
        <div>
          <div>
            <div>
              <h1>{props.user.name}</h1>
              <p>{`@${props.user.id}`}</p>
            </div>
            <FollowButton
              followeeId={props.user.id}
              isFollow={session.id in props.user.followers}
            />
          </div>
          <p>{props.user.text}</p>
        </div>
      </Link>
    );
  };

  if (error) {
    return <Error />;
  }
  if (!data) {
    return <Spinner />;
  }
  const users = data.map((user) => {
    return (
      <li key={user.id}>
        <User user={user}></User>
      </li>
    );
  });

  return (
    <Wrapper isOpen={props.isOPen}>
      <CloseButton onClick={props.onClickCloseButton} />
      <ul>{users}</ul>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

export default Users;
