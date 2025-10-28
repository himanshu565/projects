import React, { useState } from "react";
import Sidebar from "./Sidebar.js";
import Toolbar from "./Toolbar.js";
import EditorArea from "./EditorArea.js";

type Props = {
  docId?: string;
};

export const EditorLayout: React.FC<Props> = ({ docId }) => {
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
    // wiring point: call save API for docId
    return new Promise<void>((res) => setTimeout(res, 300));
  };

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <Toolbar title={`Document ${docId ?? ""}`} onSave={handleSave} />
        <main className="p-4 flex-1 overflow-auto">
          <EditorArea
            initial={""}
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

export default EditorLayout;
