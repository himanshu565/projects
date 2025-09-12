import type { FileChunk } from "./dataTypes.js";

// interface for Server to Client Events
export interface ServerToClientEvents{
    fileData: (chunk: string) => void; //sends file in chunks
    chunkDetails: (fileChunks: FileChunk[]) => void;
    chunkChanged: (chunkId: number, chunk: string, chunkVer: string) => void;
    userLeft: (userId: string) => void;
    userOpenedFile: (userId: string) => void;
    userWriting: (userId: string, caretPos: number) => void;
    userStopWriting: (userId: string) => void;
}

// interface for Client to Server Events
export interface ClientToServerEvents{
    getFileData: (fileId: string) => void;
    chunkChanged: (chunkId: number, chunk: string, vChunkId: number) => void;
    write: (caretPos: number) => void;
}


