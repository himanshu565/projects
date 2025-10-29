import React, { useEffect, useRef, type RefObject } from "react";
import debounce from "./autosave.js";
import type { ClientToServerEvents, ServerToClientEvents } from "../../../types/eventType.js";
import { io, Socket } from "socket.io-client";
import { setupEventHandlers } from "../../socket/server-event-handlers.js";

type Props = {
  onSave?: (content: string) => Promise<void> | void;
};

export const EditorArea: React.FC<Props> = ({ onSave }) => {
  const editableRef = useRef<HTMLDivElement | null>(null);
  const socket: RefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null> = useRef<Socket | null>(null);

  useEffect(() => {
      socket.current = io("http://localhost:3000");
      setupEventHandlers(socket.current);
      const fileDataHandler = (chunk: string | Buffer) => {
        if(editableRef.current){
            editableRef.current.innerText = chunk.toString();
        }
      };

      socket.current.on("fileData", fileDataHandler);
      socket.current.emit("getFileData", "file-id-123");
      return () => {
          socket.current?.disconnect();
      }
  }, [])

  const debouncedSave = useRef(
    debounce((c: string) => {
      onSave?.(c);
    }, 800)
  );

  const onInput = () => {
    const text = editableRef.current?.innerText || "";
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
      </div>
    </div>
  );
};

export default EditorArea;
