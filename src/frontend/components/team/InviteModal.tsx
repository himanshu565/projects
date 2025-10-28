import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => Promise<void> | void;
};

export const InviteModal: React.FC<Props> = ({ open, onClose, onInvite }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const emails = value
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (emails.length === 0) {
      setError("Please add at least one email");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onInvite(emails);
      setValue("");
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/40"
    >
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold">Invite teammates</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter one or more emails (comma or newline separated)
        </p>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full mt-3 p-2 border rounded h-28"
        />
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            {loading ? "Sending..." : "Send invites"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
