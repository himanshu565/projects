import React, { useEffect, useState } from "react";

type Props = {
  title?: string;
  onSave?: () => Promise<void> | void;
};

export const Toolbar: React.FC<Props> = ({ title = "Untitled", onSave }) => {
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
      </div>
      <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default Toolbar;
