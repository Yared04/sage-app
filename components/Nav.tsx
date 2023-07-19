import Link from "next/link";
import React, { useContext } from "react";
import { AppContext } from "@/pages/_app";
import { Button } from "./Button";
import router from "next/router";

// import Image from "next/image";

// import logo from "../public/um-logo-white.png";

const Nav = () => {
  const { state, setState } = useContext(AppContext);
  const logout = () => {
    window.localStorage.removeItem("token");
    setState((prevState: any) => ({
      ...prevState,
      curUser: {
        id: "",
        username: "",
      }, // or {} if you prefer an empty object
    }));
    router.push("/login"); // Redirect to the login page
  };
  return (
    <div className="bg-primary mb-7 md:mb-14 h-fit shadow-xl flex items-center justify-between py-2 px-10">
      <Link className="flex items-center" href={"/"}>
        {/* <Image src={logo} alt="SAGE Logo" className="h-fit mr-2" /> */}
        <h1 className="text-3xl text-white font-extrabold">SAGE</h1>
      </Link>
      <div className="text-white font-medium text-right">
        {state.curUser.username ? (
          <>
            <span>Welcome, {state.curUser.username}</span>
            <span
              className="cursor-pointer hover:underline ml-4 mr-4 text-sm text-white font-normal transition-all duration-200 ease-in-out "
              onClick={() => logout()}
            >
              Log Out
            </span>
          </>
        ) : (
          <Link href={"/login"}>
            <Button title={"Sign In"} size="md" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;
