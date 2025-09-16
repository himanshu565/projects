import type { JwtPayload } from 'jsonwebtoken';

interface OAuthTokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface JwtState {
    valid: boolean;
    expired: boolean;
    decoded: JwtPayload | string; 
}

interface TeamCardDetails {
    teamId: string | undefined,
    name: string | undefined,
    desc: string | undefined,
    ownerId: string | undefined,
    ownerFirstName: string | undefined,
    ownerLastName: string | undefined,
}

interface TeamPageDetails extends TeamCardDetails {
    collaborators: {
        userId: string,
        firstName: string,
        lastName: string,
    }[],

    docs: {
        docId: string,
        name: string,
    }[],
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
export type { TeamCardDetails };
export type { TeamPageDetails };
export type { JwtState };
