import { useRouter } from "next/router";

import { useSessionContext } from "../context/session";

interface Props {
  children: React.ReactNode;
}

const Private: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { setSession } = useSessionContext();
  let id: string | null = null;
  if (typeof window !== "undefined") {
    id = localStorage.getItem("id");
  }
  if (!id) {
    setSession({ isLogined: false, id: "" });
    return <></>;
  }
  setSession({ isLogined: true, id });
  return <div>{children}</div>;
};

export default Private;
