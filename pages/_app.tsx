import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export const AppContext = createContext({
  state: {
    selectedTime: new Date(),
    selectedDate: new Date(),
    curUser: { id: "", username: "" },
  },
  setState: (state: any) => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [state, setState] = useState({
    selectedTime: new Date(),
    selectedDate: new Date(),
    curUser: { id: "", username: "" },
  });

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt.verify(
          token,
          "thisisthesecrettoken"
        ) as jwt.JwtPayload;

        if (decodedToken) {
          setState((prevState: any) => ({
            ...prevState,
            curUser: {
              id: decodedToken.id,
              username: decodedToken.username,
            },
          }));
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }
  }, []);
  return (
    <>
      <AppContext.Provider value={{ state, setState }}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </>
  );
}
