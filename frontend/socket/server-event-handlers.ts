import { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../../backend/types/eventType.js";

export const setupEventHandlers = (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
    socket.on("userWriting", userWritingHandler);
};


const userWritingHandler = (userId: string, caretPosition: number) => {
    //TODO: This should add a caret at the caretPositon 
    console.log(`user ${userId} is writing at position ${caretPosition}`);
};
