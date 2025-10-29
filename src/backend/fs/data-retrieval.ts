import { open, stat } from "node:fs/promises";

const getFileReadStream = async (filePath: string): Promise<NodeJS.ReadableStream> => {
    const fileHandle = await open(filePath, 'r');
    const fileReadStream = fileHandle.createReadStream();
    return fileReadStream;
};

const getFileSize = async (filePath: string): Promise<number> => {
    const fileStat = await stat(filePath);
    return fileStat.size;
};

export { getFileReadStream, getFileSize };
