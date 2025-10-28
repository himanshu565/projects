import React, { useEffect, useState } from "react";

type Props = {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
};

export const Sidebar: React.FC<Props> = ({ collapsed = false, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  useEffect(() => {
    localStorage.setItem(
      "editor.sidebar.collapsed",
      JSON.stringify(isCollapsed)
    );
    onToggle?.(isCollapsed);
  }, [isCollapsed]);

  return (
    <aside
      className={`bg-gray-50 p-3 border-r ${isCollapsed ? "w-16" : "w-64"}`}
      aria-label="Editor sidebar"
    >
      <div className="flex items-center justify-between">
        {!isCollapsed && <h4 className="font-semibold">Outline</h4>}
        <button
          onClick={() => setIsCollapsed((s) => !s)}
          className="px-2 py-1 rounded border"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-4 text-sm text-gray-600">
          No outline available (stub)
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
