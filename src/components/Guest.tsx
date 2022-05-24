import { useRouter } from "next/router";

import { useSessionContext } from "../context/session";

interface Props {
  children: React.ReactNode;
}

const Guest: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { setSession } = useSessionContext();
  const id = localStorage.getItem("id");
  if (id) {
    router.push("/home");
    setSession({ isLogined: true, id });
    return <></>;
  }
  setSession({ isLogined: false, id: "" });
  return <div>{children}</div>;
};

export default Guest;
