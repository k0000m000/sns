import axios from "axios";

import { useSessionContext, SessionProvider } from "../../context/session";
import Posts from "../../components/Posts";

const Timeline: React.VFC = () => {
  const { session } = useSessionContext();
  let timeline = [];
  axios.get(`api/${session.id}/timeline`).then((res) => {
    if (res.status === 200) {
      timeline = res.data;
    }
  });
  return (
    <div>
      <SessionProvider>
        <Posts idList={timeline} />
      </SessionProvider>
    </div>
  );
};

export default Timeline;
