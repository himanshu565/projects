import type { Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/event-type.js";
import { logger } from "../index.js";
import { open, stat } from "node:fs/promises";
import { FileChunk } from "../types/data-types.js";

// documents directory
const docDir: string = process.env.PROJ_DIR || "/var/proj/doc/";

export const clientEventHandlers = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {

    const writeHandler = (caretPos: number) => {
        // TODO: this function would emit writer details to all the other collaborators
        logger.info(`user is writing at ${caretPos}`);
        socket.broadcast.in("file-details").emit("userWriting",socket.data.user, caretPos);
    };

    const getFileDataHandler = async (fileId: string) => {

        const fileName = "xfile"; //TODO: should get file name & auth details from DB using fileId

        console.log("user has requested a file");

        if(true /*TODO: Should check if user has correct authorizations to access this file*/){

            const fileHandle = await open(docDir + fileName, 'r');
            const fileStream = fileHandle.createReadStream();
            const fileStat = await stat(docDir + fileName); 
            fileStream.on("data", (chunk) => {
                // TODO: should first send events to redis for emit replay upon connection failure
                socket.emit("fileData", chunk.toString());
            });

            console.log(fileStat.size);

            let fileChunks: FileChunk[] = [];
            for(let i = 0; i < Math.ceil(fileStat.size/30); ++i){
                
                let chunk: FileChunk = new FileChunk(1, i*30, 30); 
                
                if(Math.ceil(fileStat.size/30) - 1 === i){
                    chunk.chunkSize = fileStat.size%30;
                }

                fileChunks[i] = chunk;
            }

            socket.emit("chunkDetails", fileChunks);
        }
    } 

    socket.on("write", writeHandler);
    socket.on("getFileData", getFileDataHandler);
};
