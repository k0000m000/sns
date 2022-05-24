import { createContext, useState, useContext } from "react";

export interface Session {
  isLogined: boolean;
  id: string;
}

const sessionContext = createContext(
  {} as {
    session: Session;
    setSession: React.Dispatch<React.SetStateAction<Session>>;
  }
);

export const useSessionContext = () => {
  return useContext(sessionContext);
};

interface Props {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState<Session>({ isLogined: false, id: "" });
  const value = {
    session,
    setSession,
  };

  return (
    <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
  );
};
