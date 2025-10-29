import type { Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../../types/eventType.js";
import { db, logger } from "../index.js";
import { getFileReadStream, getFileSize } from "../fs/data-retrieval.js";
import { docsTable } from "../db/schemas/docs.js";
import { and, eq } from "drizzle-orm";
import { userDocJunctionTable } from "../db/schemas/userDocJunction.js";

// documents directory
const docDir: string = process.env.PROJ_DIR || "/var/proj/doc/";

export const clientEventHandlers = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {

    const writeHandler = (caretPos: number) => {
        // TODO: this function would emit writer details to all the other collaborators
        logger.info(`user is writing at ${caretPos}`);
        socket.broadcast.in("file-details").emit("userWriting",socket.data.user, caretPos);
    };

    const getFileDataHandler = async (publicId: string) => {

        const docDetails = await db.select({
            docId: docsTable.id,
            docName: docsTable.name,
        })
        .from(docsTable)
        .where(eq(docsTable.publicId, publicId));

        if(docDetails.length === 0 || !docDetails[0]){
            //TODO: Add error handling for no document found
            logger.error(`No document found with public ID: ${publicId}`);
            return;
        }

        const userDocRole = await db.select({
            userRole: userDocJunctionTable.role,
        })
        .from(userDocJunctionTable)
        .where(
            and(
                eq(userDocJunctionTable.docId, docDetails[0].docId),
                eq(userDocJunctionTable.userId, socket.data.user.id),
                eq(userDocJunctionTable.teamId, socket.data.user.teamId)
            )
        );

        if(userDocRole.length === 0 || !userDocRole[0]){
            //TODO: Add error handling for no user-document mapping found
            logger.error(`No user-document mapping found for user ID: ${socket.data.user.id} and document ID: ${docDetails[0].docId}`);
            return;
        }

        const filePath = docDir + docDetails[0].docName + ".txt";
        const fileReadStream = await getFileReadStream(filePath);
        
        fileReadStream.on("data", (chunk: Buffer) => {
            socket.emit("fileData", chunk.toString());
        });

        const fileSize = await getFileSize(filePath);
        
        console.log(`File size is ${fileSize} bytes`);
    } 

    socket.on("write", writeHandler);
    socket.on("getFileData", getFileDataHandler);
};
