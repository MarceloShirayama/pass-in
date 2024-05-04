import crypto from "node:crypto";

export class Encrypt {
  static readonly salt: string = crypto.randomBytes(16).toString('hex');
  static readonly iterations: number = 10;
  static readonly keylen: number = 32;

  static hash(password: string): string {
    const hash = crypto.pbkdf2Sync(password, Encrypt.salt, Encrypt.iterations, Encrypt.keylen, 'sha512').toString('hex');
    return `${Encrypt.salt}.${hash}`;
  }

  static compare(password: string, storedHash: string): boolean {
    const [_, hash] = storedHash.split('.');
    const hashToCheck = crypto.pbkdf2Sync(password, Encrypt.salt, Encrypt.iterations, Encrypt.keylen, 'sha512').toString('hex');
    return hash === hashToCheck;
  }
}