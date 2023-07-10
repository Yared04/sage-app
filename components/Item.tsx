import clsx from "clsx";
import React from "react";
interface ItemProps {
  props: {
    name: string;
    color_flag: boolean;
    createdAt: Date;
  };
}
export const Item = ({ props }: ItemProps) => {
  return (
    <div
      className={clsx(
        "pt-6 pb-3 px-6 shadow-xl rounded-xl",
        !props.color_flag ? "bg-slate-100" : "bg-white"
      )}
    >
      <h1 className="text-xl font-bold ">{props.name}</h1>
      <p>
        Created at:{" "}
        {new Date(props.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>{" "}
    </div>
  );
};
