import React from "react";

export type Doc = {
  id: string;
  title: string;
  snippet?: string;
  lastEdited?: string; // ISO
  starred?: boolean;
  ownerId?: string;
};

type Props = {
  doc: Doc;
  onOpen?: (id: string) => void;
  onToggleStar?: (id: string) => void;
};

export const DocCard: React.FC<Props> = ({ doc, onOpen, onToggleStar }) => {
  return (
    <article
      className="p-4 bg-white rounded shadow-sm hover:shadow-md flex justify-between items-start"
      role="article"
    >
      <div className="flex-1" onClick={() => onOpen?.(doc.id)} tabIndex={0}>
        <h3 className="font-semibold text-base">{doc.title}</h3>
        {doc.snippet && (
          <p className="text-sm text-gray-600 mt-1">{doc.snippet}</p>
        )}
        {doc.lastEdited && (
          <time className="text-xs text-gray-400 mt-2 block">
            {new Date(doc.lastEdited).toLocaleString()}
          </time>
        )}
      </div>

      <div className="ml-4 flex items-center">
        <button
          aria-label={doc.starred ? "Unstar document" : "Star document"}
          className="p-2 rounded hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar?.(doc.id);
          }}
        >
          {doc.starred ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
};

export default DocCard;
