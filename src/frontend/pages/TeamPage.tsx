import React from "react";
import TeamManagement from "../components/team/TeamManagement.js";
import DocsList from "../components/docs/DocsList.js";

export function TeamPage() {
  // For now this page shows team management controls and a docs list.
  // TODO: wire real teamId from router params or context
  const exampleTeamId = "";
  return (
    <div className="p-6 space-y-6">
      <TeamManagement />
      <section>
        <h2 className="text-lg font-semibold mb-2">Team documents</h2>
        <DocsList teamId={exampleTeamId} />
      </section>
    </div>
  );
}

export default TeamPage;
