import type { FileChunk } from "./dataTypes.js";

// interface for Server to Client Events
export interface ServerToClientEvents{
    fileData: (chunk: string) => void; //sends file in chunks
    userLeft: (userId: string) => void;
    userOpenedFile: (userId: string) => void;
    userWriting: (userId: string, caretPos: number) => void;
    userStopWriting: (userId: string) => void;
}

// interface for Client to Server Events
export interface ClientToServerEvents{
    getFileData: (fileId: string) => void;
    write: (caretPos: number) => void;
}


