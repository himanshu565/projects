import React, { useState, useEffect } from "react";
import { EditorState } from "prosemirror-state";
import {
  ProseMirror,
  ProseMirrorDoc,
  reactKeys,
} from "@handlewithcare/react-prosemirror";
import { exampleSetup } from "prosemirror-example-setup";
import { schema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
  initProseMirrorDoc,
} from "y-prosemirror";
import { DOMSerializer } from "prosemirror-model";
import DOMPurify from "dompurify";
import "./editor.css";

type Props = {
  roomId?: string;
  onSave?: (content: any) => Promise<void> | void;
  showPreview?: boolean;
};

export const EditorArea: React.FC<Props> = ({
  roomId,
  onSave,
  showPreview = false,
}) => {
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  useEffect(() => {
    const ydoc = new Y.Doc();
    const newProvider = new SocketIOProvider(
      "ws://localhost:3000",
      roomId || "default-room",
      ydoc,
      {
        autoConnect: true,
        auth: { token: "optional-auth-token" },
      }
    );

    newProvider.on("status", ({ status }: { status: string }) => {
      console.log(status); // Logs "connected" or "disconnected"
    });

    const yXmlFragment = ydoc.getXmlFragment("prosemirror");
    const { doc, mapping } = initProseMirrorDoc(yXmlFragment, schema);
    const defaultState = EditorState.create({
      doc,
      schema,
      plugins: [
        ySyncPlugin(yXmlFragment, { mapping }),
        yCursorPlugin(newProvider.awareness),
        yUndoPlugin(),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
          "Mod-Shift-z": redo,
        }),
        keymap(baseKeymap),
        reactKeys(),
      ].concat(exampleSetup({ schema })),
    });

    setEditorState(defaultState);

    // set local user info for awareness (so cursors show name/color)
    try {
      const userName =
        (window as any).__USER_NAME__ ||
        localStorage.getItem("userName") ||
        `User-${Math.floor(Math.random() * 10000)}`;
      const colors = [
        "#EF4444",
        "#F97316",
        "#F59E0B",

        "#10B981",
        "#06B6D4",
        "#3B82F6",
        "#8B5CF6",
        "#EC4899",
      ];
      const userColor = colors[Math.floor(Math.random() * colors.length)];
      newProvider.awareness.setLocalStateField("user", {
        name: userName,
        color: userColor,
      });
    } catch (e) {
      // ignore if awareness not available synchronously
    }

    window.example = { ydoc, provider: newProvider, yXmlFragment, pmDoc: doc };

    // compute preview HTML when state changes
    const updatePreview = () => {
      try {
        const serializer = DOMSerializer.fromSchema(schema);
        const wrapper = document.createElement("div");
        wrapper.appendChild(
          serializer.serializeFragment(defaultState.doc.content)
        );
        const raw = wrapper.innerHTML;
        setPreviewHtml(DOMPurify.sanitize(raw));
      } catch (err) {
        setPreviewHtml("");
      }
    };

    // initial preview
    updatePreview();

    // simple listener to update preview on every update (lightweight)
    const observer = (tr: any) => updatePreview();
    // note: we can't attach to ProseMirror transactions easily here without dispatch hook,
    // but our preview updater will be called when dispatchTransaction runs and sets editorState.

    return () => {
      newProvider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  // update preview HTML whenever the editor state changes
  useEffect(() => {
    if (!editorState) return;
    try {
      const serializer = DOMSerializer.fromSchema(schema);
      const wrapper = document.createElement("div");
      wrapper.appendChild(
        serializer.serializeFragment(editorState.doc.content)
      );
      const raw = wrapper.innerHTML;
      setPreviewHtml(DOMPurify.sanitize(raw));
    } catch (err) {
      setPreviewHtml("");
    }
  }, [editorState]);

  if (!editorState) {
    return <div>Loading editor...</div>;
  }

  if (showPreview) {
    return (
      <div className="pm-root mx-auto mt-8 max-w-3xl rounded-md border bg-white shadow-sm p-4">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    );
  }

  return (
    <div className="pm-root mx-auto mt-8 max-w-3xl rounded-md border bg-white shadow-sm">
      <ProseMirror
        state={editorState}
        dispatchTransaction={(tr) => {
          setEditorState((s) => s?.apply(tr) || s);
        }}
      >
        <ProseMirrorDoc />
      </ProseMirror>
    </div>
  );
};

export default EditorArea;

// try it once
// tryitonce again tanmay
/// try it more boys 
