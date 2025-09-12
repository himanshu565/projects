import crypto from 'crypto';

export function generateRandomBase64Url(bytes = 32): string {
  return crypto.randomBytes(bytes)
    .toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256Base64Url(input: string): Promise<string> {
  const hash = crypto.createHash('sha256').update(input).digest('base64');
  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

