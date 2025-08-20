// interface for Server to Client Events
export interface ServerToClientEvents{
    chunkChanged: (chunkId: number, chunk: string, vChunkId: number) => void;
    userLeft: (userId: string) => void;
    userOpenedFile: (userId: string) => void;
    userWriting: (userId: string, caretPos: number) => void;
    userStopWriting: (userId: string) => void;
}

// interface for Client to Server Events
export interface ClientToServerEvents{
    chunkChanged: (chunkId: number, chunk: string, vChunkId: number) => void;
    write: (caretPos: number) => void;
}


