import React from "react";

type Props = {
  role: "owner" | "admin" | "member" | string;
};

export const RolePill: React.FC<Props> = ({ role }) => {
  const color =
    role === "owner"
      ? "bg-yellow-200 text-yellow-800"
      : role === "admin"
      ? "bg-blue-200 text-blue-800"
      : "bg-gray-100 text-gray-800";
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {role}
    </span>
  );
};

export default RolePill;
