import type { Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../../types/eventType.js";
import { logger } from "../index.js";

export const specialEventHandlers = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {

    const disconnectHandler = (reason: any) => {
        //TODO: add all case handlers when client disconnects
        if(true){
            socket.broadcast.in("file-name").emit("userLeft","id");
        }
        logger.info(`User Disconnected: ${reason}`);
    };

    socket.on("disconnect", disconnectHandler);
};
