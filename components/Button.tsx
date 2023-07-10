import clsx from "clsx";
import React from "react";
export interface ButtonProps {
  title: string;
  size: string;
}

export const Button = ({ title, size }: ButtonProps) => {
  return (
    <>
      <button
        className={clsx(
          " font-bold bg-primary text-white rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          size === "sm"
            ? "text-lg w-24 h-10"
            : size === "md"
            ? "text-xl w-32 h-12"
            : ""
        )}
      >
        {title}
      </button>
    </>
  );
};
