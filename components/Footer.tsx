import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 mt-10 pt-10">
        <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-center items-center">
          {/* Image */}
          <div className="p-5">
            <Image
              src={"/um-logo-white.png"}
              width={500}
              height={500}
              alt={"img-1"}
            />
          </div>
        </div>
        <div className="max-w-6xl m-auto text-gray-800 flex justify-center items-center py-4">
          {/* Copyright */}
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SAGE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
