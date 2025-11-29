import React, { useEffect, useState } from "react";

type Props = {
  title?: string;
  onSave?: () => Promise<void> | void;
  onRename?: () => void;
  onShare?: () => void;
  onTogglePreview?: (next: boolean) => void;
  showPreview?: boolean;
  accessState?: "read-only" | "editing";
};

export const Toolbar: React.FC<Props> = ({
  title = "Untitled",
  onSave,
  onRename,
  onShare,
  onTogglePreview,
  showPreview = false,
  accessState = "editing",
}) => {
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");

  useEffect(() => {
    setStatus("saved");
  }, [title]);

  const doSave = async () => {
    setStatus("saving");
    try {
      await onSave?.();
      setStatus("saved");
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold">{title}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            accessState === "editing"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {accessState === "editing" ? "Editing" : "Read-only"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTogglePreview?.(!showPreview)}
          className="px-2 py-1 border rounded text-sm"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
        <span className="text-sm text-gray-500">
          {status === "saving"
            ? "Saving…"
            : status === "saved"
            ? "Saved"
            : "Error"}
        </span>
        <button
          onClick={doSave}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Save
        </button>
        <button onClick={onRename} className="px-3 py-1 border rounded">
          Rename
        </button>
        <button onClick={onShare} className="px-3 py-1 border rounded">
          Share
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
