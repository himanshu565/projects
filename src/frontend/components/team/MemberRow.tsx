import React from "react";
import RolePill from "./RolePill.js";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | string;
  lastActive?: string;
};

type Props = {
  member: Member;
  onChangeRole?: (id: string, role: string) => void;
  onRemove?: (id: string) => void;
};

export const MemberRow: React.FC<Props> = ({
  member,
  onChangeRole,
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
      <div>
        <div className="font-medium">{member.name}</div>
        <div className="text-sm text-gray-500">{member.email}</div>
      </div>

      <div className="flex items-center gap-3">
        <RolePill role={member.role} />
        <select
          aria-label={`Change role for ${member.name}`}
          defaultValue={member.role}
          onChange={(e) => onChangeRole?.(member.id, e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="owner">owner</option>
          <option value="admin">admin</option>
          <option value="member">member</option>
        </select>

        <button
          className="text-red-600 hover:underline"
          onClick={() => onRemove?.(member.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default MemberRow;
