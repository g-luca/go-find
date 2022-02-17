import Crypto from "crypto"
import Long from 'long';

export default class CryptoUtils {


    /**
     * Hash a string with SHA256
     * @param string message or string to hash
     * @returns Base64 hash result
     */
    public static sha256(string: string): string {
        return Crypto.createHash('sha256').update(string).digest('hex');
    }


    /**
     * Hash a string with SHA256
     * @param string message or string to hash
     * @returns Base64 hash result
     */
    public static sha256Buffer(buffer: Buffer): Buffer {
        return Crypto.createHash('sha256').update(buffer).digest();
    }


    public static randomString(n: number): string {
        return Crypto.randomBytes(n).toString('hex');
    }


    /**
     * AES-256-CBC string encryption
     * @param password passhrase string used to encrypt the data, at least 48 byte (ex. sha256)
     * @param text plain text string string to encrypt
     * @returns encrypted hex string
     */
    public static encryptAes(password: string, text: string): string {
        const key = password.slice(0, 32);
        const iv = password.slice(32, 48);
        const cipher = Crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return encrypted.toString('hex');
    }


    /**
     * AES-256-CBC string decryption
     * @param password passhrase string used to decrypt the data
     * @param encrypted encrypted text string to decrypt
     * @returns utf-8 decrypted string
     */
    public static decryptAes(password: string, encrypted: string): string {
        const key = password.slice(0, 32);
        const iv = password.slice(32, 48);
        const decipher = Crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    }





    //https://github.com/cosmos/cosmjs/blob/79396bfaa49831127ccbbbfdbb1185df14230c63/packages/amino/src/signdoc.ts
    public static sortedObject(obj: any): any {
        if (typeof obj !== "object" || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(CryptoUtils.sortedObject);
        }
        const sortedKeys = Object.keys(obj).sort();
        const result: Record<string, any> = {};
        // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
        sortedKeys.forEach((key) => {
            result[key] = CryptoUtils.sortedObject(obj[key]);
        });
        return result;
    }

    /** Returns a JSON string with objects sorted by key */
    public static sortedJsonStringify(obj: any): string {
        return JSON.stringify(CryptoUtils.sortedObject(obj));
    }




    public static parseSignDocValues(signDoc: any) {
        return {
            ...signDoc,
            bodyBytes: this.fromHex(signDoc.bodyBytes),
            authInfoBytes: this.fromHex(signDoc.authInfoBytes),
            accountNumber: Long.fromNumber(parseInt(signDoc.accountNumber, 16)),
        };
    }


    public static fromHex(hexstring: string): Uint8Array {
        if (hexstring.length % 2 !== 0) {
            throw new Error("hex string length must be a multiple of 2");
        }

        const listOfInts: number[] = [];
        for (let i = 0; i < hexstring.length; i += 2) {
            const hexByteAsString = hexstring.substr(i, 2);
            if (!hexByteAsString.match(/[0-9a-f]{2}/i)) {
                throw new Error("hex string contains invalid characters");
            }
            listOfInts.push(parseInt(hexByteAsString, 16));
        }
        return new Uint8Array(listOfInts);
    }
    public static stringifySignDocValues(signDoc: any) {
        return {
            ...signDoc,
            bodyBytes: this.toHex(signDoc.bodyBytes),
            authInfoBytes: this.toHex(signDoc.authInfoBytes),
            accountNumber: signDoc.accountNumber.toString(16),
        };
    }
    public static toHex(data: Uint8Array): string {
        let out = "";
        for (const byte of data) {
            out += ("0" + byte.toString(16)).slice(-2);
        }
        return out;
    }

}


//window['CryptoUtils'] = CryptoUtils;