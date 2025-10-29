import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TeamCardDetails, DocCardDetails } from "../../../types/dataTypes.js";

type Props = {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  teamDetails?: TeamCardDetails;
  docDetails?: DocCardDetails[];
};

const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const Sidebar: React.FC<Props> = ({
  collapsed = false,
  onToggle,
  teamDetails,
  docDetails = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(
      "editor.sidebar.collapsed",
      JSON.stringify(isCollapsed)
    );
    onToggle?.(isCollapsed);
  }, [isCollapsed, onToggle]);

  const handleDocClick = (docPublicId: string | undefined) => {
    if (teamDetails && teamDetails.teamId)
    {
      navigate(`/team/${teamDetails.teamId}/doc/${docPublicId}`);
    }
  };

  return (
    <aside
      className={`bg-gray-50 p-3 border-r transition-all ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      aria-label="Editor sidebar"
    >
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h4 className="font-semibold text-gray-800">Sidebar</h4>}
        <button
          onClick={() => setIsCollapsed((s) => !s)}
          className="px-2 py-1 rounded border hover:bg-gray-200 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-6 text-sm">
          {/* Team Details Section */}
          {teamDetails && (
            <section className="space-y-2">
              <h5 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                Team Details
              </h5>
              <div className="bg-white rounded p-3 border border-gray-200 space-y-2">
                <div>
                  <p className="font-medium text-gray-900">{teamDetails.name}</p>
                  {teamDetails.teamId && (
                    <p className="text-xs text-gray-500">ID: {teamDetails.teamId}</p>
                  )}
                </div>
                {teamDetails.desc && (
                  <p className="text-gray-600 text-xs">{teamDetails.desc}</p>
                )}
                {(teamDetails.ownerFirstName || teamDetails.ownerLastName) && (
                  <p className="text-xs text-gray-500">
                    Owner: {teamDetails.ownerFirstName || ""} {teamDetails.ownerLastName || ""}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* File References Section */}
          <section className="space-y-2">
            <h5 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
              File References
            </h5>
            {docDetails.length === 0 ? (
              <div className="bg-white rounded p-3 border border-gray-200 text-gray-500 text-xs">
                No files available
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {docDetails.map((doc) => (
                  <button
                    key={doc.docId}
                    onClick={() => handleDocClick(doc.docId)}
                    className="w-full text-left bg-white rounded p-3 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 text-xs group-hover:text-blue-700">
                        {doc.name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.docId}</span>
                        {doc.size !== undefined && (
                          <span>{formatFileSize(doc.size)}</span>
                        )}
                      </div>
                      {doc.lastEdited && (
                        <p className="text-xs text-gray-400">
                          Edited: {formatDate(doc.lastEdited)}
                        </p>
                      )}
                      {(doc.ownerFirstName || doc.ownerLastName) && (
                        <p className="text-xs text-gray-400">
                          {doc.ownerFirstName || ""} {doc.ownerLastName || ""}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
