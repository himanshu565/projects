import type { Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/event-type.js";
import { logger } from "../index.js";

export const serverEventListeners = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {

    const writeListener = (caretPos: number) => {
        // TODO: this function would emit writer details to all the other collaborators
        logger.info(`user is writing at ${caretPos}`);
        socket.broadcast.in("file-details").emit("userWriting",socket.data.user, caretPos);
    };

    socket.on("write", writeListener);
};
