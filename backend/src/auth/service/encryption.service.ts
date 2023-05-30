import { Injectable } from "@nestjs/common";
import {
    BinaryLike,
    CipherKey,
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes
} from "crypto";

/*
**  Cipher and Decipher cannot be reused. That's why they are redeclared
**  on their respective methods.
*/
@Injectable()
export class EncryptionService {

    private _iv: BinaryLike;
    private _key: CipherKey;

    constructor() {
        this._init();
    }

    private _init(): void {
        const   keyPass: string = "TestPass"; //Provisional. Use environment variable?
    
        this._iv = randomBytes(16);
        this._key = createHash('sha256').update(keyPass).digest('base64')
                                                        .slice(0, 32);
    }

    encrypt(input: string): string {
        const   cipher = createCipheriv('aes-256-ctr', this._key, this._iv);
    
        return (
            Buffer.concat([
                cipher.update(input),
                cipher.final(),
            ]).toString('base64')
        );
    }

    decrypt(input: string): string {
        const   decipher = createDecipheriv('aes-256-ctr', this._key, this._iv);
        const   inputBuffer: Buffer = Buffer.from(input, 'base64');
    
        return (
            Buffer.concat([
                decipher.update(inputBuffer),
                decipher.final(),
            ]).toString()
        );
    }

}
