import { useEffect, useRef} from 'react';
import type { RefObject } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../../backend/types/eventType.js';
import type { FileChunk } from '../../backend/types/dataTypes.js';
import { setupEventHandlers } from '../socket/server-event-handlers.js';

export function FilePage() {
    
    const chunkDetails = useRef<FileChunk[]>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const socket: RefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null> = useRef<Socket | null>(null);

    useEffect(() => {
        socket.current = io("http://localhost:3000");
        setupEventHandlers(socket.current);
        const fileDataHandler = (chunk: string | Buffer) => {
            if(textareaRef.current){
                textareaRef.current.value = textareaRef.current.value + chunk;
            }
        };
        const chunkDetailsHandler = (fileChunks: FileChunk[]) => {
            chunkDetails.current = fileChunks;
            console.log(chunkDetails.current);
        }

        socket.current.on("fileData", fileDataHandler);
        socket.current.on("chunkDetails", chunkDetailsHandler);
        socket.current.emit("getFileData", "243324");
        return () => {
            socket.current?.disconnect();
        }
    }, [])

    const caretPositionChange = (): void => {
        if(socket.current){
            console.log("socket emit");
            socket.current.emit("write", textareaRef.current ? textareaRef.current.selectionStart : 0);
        }
        else{
            console.log("socket was null");
        }
    };

    return (
        <div>
            <textarea id="file-data" ref={textareaRef} onClick={caretPositionChange} />
        </div>
    );
} 
