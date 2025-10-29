import React, { useState } from "react";
import type { DocCardDetails, TeamCardDetails } from "../../types/dataTypes.js";
import Sidebar from "../components/editor/Sidebar.js";
import Toolbar from "../components/editor/Toolbar.js";
import EditorArea from "../components/editor/EditorArea.js";

type Props = {
  docId?: string;
  teamDetails?: TeamCardDetails;
  docDetails?: DocCardDetails[];
};

export const DocPage: React.FC<Props> = ({
  docId,
  teamDetails,
  docDetails,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("editor.sidebar.collapsed") || "false"
      );
    } catch {
      return false;
    }
  });

  const handleSave = async () => {
    return new Promise<void>((res) => setTimeout(res, 300));
  };

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        {...(teamDetails && { teamDetails })}
        {...(docDetails && { docDetails })}
      />
      <div className="flex-1 flex flex-col">
        <Toolbar title={`Document ${docId ?? ""}`} onSave={handleSave} />
        <main className="p-4 flex-1 overflow-auto">
          <EditorArea
            onSave={async (content) => {
              await handleSave();
              console.log("autosaved", content);
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DocPage;
