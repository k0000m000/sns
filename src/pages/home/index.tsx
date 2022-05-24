import { useState } from "react";
import dynamic from "next/dynamic";

import Private from "../../components/Private";
import User from "../../components/User";
import CreatePost from "../../components/CreatePost";
import { useSessionContext } from "../../context/session";

const Index: React.FC = () => {
  const { session } = useSessionContext();
  const [isNewPostOPen, setIsNewPostOpen] = useState<boolean>(true);
  return (
    <div>
      <Private>
        <User id={session.id} />
        <CreatePost
          isOpen={isNewPostOPen}
          onClickOpenButton={() => setIsNewPostOpen(true)}
          postSuccess={() => setIsNewPostOpen(false)}
          onClickCloseButton={() => setIsNewPostOpen(false)}
        ></CreatePost>
      </Private>
    </div>
  );
};

export default Index;
