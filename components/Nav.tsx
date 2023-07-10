import Link from "next/link";
import React, { useContext } from "react";
import { AppContext } from "@/pages/_app";
import { Button } from "./Button";

// import Image from "next/image";

// import logo from "../public/um-logo-white.png";

const Nav = () => {
  const { state } = useContext(AppContext);
  return (
    <div className="bg-primary mb-7 md:mb-14 h-fit shadow-xl flex items-center justify-between py-2 px-10">
      <Link className="flex items-center" href={"/"}>
        {/* <Image src={logo} alt="SAGE Logo" className="h-fit mr-2" /> */}
        <h1 className="text-3xl text-white font-extrabold">SAGE</h1>
      </Link>
      <div className="text-white font-medium text-right">
        {state.curUser.username ? (
          <span>Welcome, {state.curUser.username}</span>
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
