import axios from "axios";

import { mutate } from "swr";
import { useSessionContext } from "../context/session";

interface Props {
  isFollow: boolean;
  followeeId: string;
}

const FollowButton: React.FC<Props> = (props) => {
  const { session } = useSessionContext();
  const handleClick = () => {
    props.isFollow
      ? axios.delete(`/api/users/${session.id}/followees/${props.followeeId}`)
      : axios.post(`/api/users/${session.id}/followees`, {
          id: props.followeeId,
        });
    mutate(`/api/users/${props.followeeId}`);
  };

  return (
    <a onClick={handleClick}>
      {props.isFollow ? "フォロー中" : "フォローする"}
    </a>
  );
};

export default FollowButton;
