import { useEffect, useRef} from 'react';
import type { RefObject } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../../backend/types/event-type.js';
import { userWritingListener } from '../socket/client-event-listeners.js';

export function FilePage() {

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const socket: RefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null> = useRef<Socket | null>(null);

    useEffect(() => {
        socket.current = io("http://localhost:3000");
        socket.current.on("userWriting", userWritingListener);
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
