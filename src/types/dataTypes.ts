import type { JwtPayload } from 'jsonwebtoken';

interface InviteResponse {
    success: boolean;
    invites: number;
}

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
interface DocCardDetails {
    docId: string | undefined,
    name: string | undefined,
    ownerId: string | undefined,
    ownerFirstName: string | undefined,
    ownerLastName: string | undefined,
    lastEdited: string | undefined,
    lastEditorId: string | undefined,
    lastEditorFirstName: string | undefined,
    lastEditorLastName: string | undefined,
    size: number | undefined,
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

export type { InviteResponse };
export type { OAuthTokenResponse };
export type { TeamCardDetails };
export type { DocCardDetails };
export type { TeamPageDetails };
export type { JwtState };
