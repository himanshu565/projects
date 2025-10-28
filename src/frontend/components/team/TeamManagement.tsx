import React, { useState } from "react";
import MemberRow from "./MemberRow.js";
import type { Member } from "./MemberRow.js";
import InviteModal from "./InviteModal.js";

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    role: "owner",
    lastActive: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    role: "admin",
    lastActive: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Carol",
    email: "carol@example.com",
    role: "member",
    lastActive: new Date().toISOString(),
  },
];

export const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleChangeRole = (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  const handleRemove = (id: string) => {
    if (!confirm("Remove member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleInvite = async (emails: string[]) => {
    // stub: call TRPC mutation to invite
    console.log("invite", emails);
    // simulate adding to a pending list or show toast
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Team members</h2>
        <div>
          <button
            onClick={() => setInviteOpen(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Invite
          </button>
        </div>
      </header>

      <div className="space-y-2">
        {members.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            onChangeRole={handleChangeRole}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default TeamManagement;
