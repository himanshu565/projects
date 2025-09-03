import type { JwtPayload } from 'jsonwebtoken';

interface OAuthTokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export class FileChunk{
    static readonly MAX_CHUNK_SIZE: number = 4096;
    static readonly DEFUALT_INIT_CHUNK_SIZE: number = 1024;
    chunkVer: number; // 4Kib of data
    chunkBegin: number;
    chunkSize: number = FileChunk.DEFUALT_INIT_CHUNK_SIZE;

    constructor(chunkVer: number, chunkBegin: number);
    constructor(chunkVer: number, chunkBegin: number, chunkSize: number);

    constructor(chunkVer: number, chunkBegin: number, chunkSize?: number){
        this.chunkVer = chunkVer;
        this.chunkBegin = chunkBegin;
        if(chunkSize !== undefined) {
            this.chunkSize = chunkSize;
        }
    }
}

export type { OAuthTokenResponse };
export type { AuthenticatedRequest };
