import React, { useState, useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import { ProseMirror, ProseMirrorDoc, reactKeys } from '@handlewithcare/react-prosemirror'
import { exampleSetup } from 'prosemirror-example-setup'
import { schema } from 'prosemirror-schema-basic'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo, initProseMirrorDoc } from 'y-prosemirror'

type Props = {
    roomId?: string;
    onSave?: (content: any) => Promise<void> | void;
};

export const EditorArea: React.FC<Props> = ({ roomId, onSave }) => {
    const [editorState, setEditorState] = useState<EditorState | null>(null);
    const [provider, setProvider] = useState<SocketIOProvider | null>(null);

    useEffect(() => {
        const ydoc = new Y.Doc();
        const newProvider = new SocketIOProvider(
            'ws://localhost:3000',
            roomId || 'default-room',
            ydoc,
            {
                autoConnect: true,
                auth: { token: 'optional-auth-token' }
            }
        );

        newProvider.on('status', ({ status }: { status: string }) => {
            console.log(status) // Logs "connected" or "disconnected"
        });

        const yXmlFragment = ydoc.getXmlFragment('prosemirror')
        const { doc, mapping } = initProseMirrorDoc(yXmlFragment, schema)
        const defaultState = EditorState.create({
            doc,
            schema,
            plugins: [
                ySyncPlugin(yXmlFragment, { mapping }),
                yCursorPlugin(newProvider.awareness),
                yUndoPlugin(),
                keymap({
                    'Mod-z': undo,
                    'Mod-y': redo,
                    'Mod-Shift-z': redo
                }),
                keymap(baseKeymap),
                reactKeys()
            ].concat(exampleSetup({ schema }))
        });

        setProvider(newProvider);
        setEditorState(defaultState);

        window.example = { ydoc, provider: newProvider, yXmlFragment, pmDoc: doc };

        return () => {
            newProvider.destroy();
            ydoc.destroy();
        };
    }, [roomId]);

    if (!editorState) {
        return <div>Loading editor...</div>;
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
