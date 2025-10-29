import React, { useEffect, useRef, useState } from "react";
import debounce from "./autosave.js";

type Props = {
  initial?: string;
  onSave?: (content: string) => Promise<void> | void;
};

export const EditorArea: React.FC<Props> = ({ initial = "", onSave }) => {
  const [content, setContent] = useState(initial);
  const editableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setContent(initial);
  }, [initial]);

  const debouncedSave = useRef(
    debounce((c: string) => {
      onSave?.(c);
    }, 800)
  );

  const onInput = () => {
    const text = editableRef.current?.innerText || "";
    setContent(text);
    debouncedSave.current(text);
  };

  return (
    <div className="editor-area">
      <div
        ref={editableRef}
        contentEditable
        role="textbox"
        aria-label="Document editor"
        onInput={onInput}
        className="min-h-[300px] border p-4 rounded focus:outline-none"
        suppressContentEditableWarning
      >
        {initial}
      </div>
    </div>
  );
};

export default EditorArea;
