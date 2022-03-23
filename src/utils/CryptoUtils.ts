import Long from 'long';
import { Buffer } from "buffer";
import { SHA256, AES, RIPEMD160, enc, mode, format, lib } from "crypto-js"
export default class CryptoUtils {

    /**
     * Hash a string with RIPEMD-160
     * @param string 
     * @returns Hex hash result
     */
    public static ripemd160(string: string): string {
        return RIPEMD160(string).toString(enc.Hex);
    }

    /**
     * Hash a buffer with RIPEMD-160
     * @param string message or string to hash
     * @returns Buffer hash result
     */
    public static ripemd160Buffer(buffer: Buffer): Buffer {
        const wordArray = lib.WordArray.create(buffer as any); // convert Buffer to WordArray
        return Buffer.from(RIPEMD160(wordArray).toString(enc.Hex), 'hex');
    }

    /**
     * Hash a string with SHA256
     * @param string message or string to hash
     * @returns Hex hash result
     */
    public static sha256(string: string): string {
        return SHA256(string).toString(enc.Hex)
    }


    /**
     * Hash a buffer with SHA256
     * @param string message or string to hash
     * @returns Buffer hash result
     */
    public static sha256Buffer(buffer: Buffer): Buffer {
        const wordArray = lib.WordArray.create(buffer as any); // convert Buffer to WordArray
        return Buffer.from(SHA256(wordArray).toString(enc.Hex), 'hex');
    }


    /**
     * Generate a random string of the specified length
     * @param n string length
     * @returns random fixed length string
     */
    public static randomString(n: number): string {
        return [...Array(length + 10)].map((value) => (Math.random() * 1000000).toString(36).replace('.', '')).join('').substring(0, n);
    }


    /**
     * AES-256-CBC string encryption
     * @param password passhrase string used to encrypt the data, at least 48 byte (ex. sha256)
     * @param text plain text string string to encrypt
     * @returns encrypted hex string
     */
    public static encryptAes(password: string, text: string): string {
        const key = enc.Utf8.parse(password.slice(0, 32));
        const iv = enc.Utf8.parse(password.slice(32, 48));
        const encrypted = AES.encrypt(text, key, {
            iv: iv,
            mode: mode.CBC,
        });
        return encrypted.toString(format.Hex);
    }


    /**
     * AES-256-CBC string decryption
     * @param password passhrase string used to decrypt the data
     * @param encrypted encrypted text string to decrypt
     * @returns utf-8 decrypted string
     */
    public static decryptAes(password: string, encrypted: string): string {
        const key = enc.Utf8.parse(password.slice(0, 32));
        const iv = enc.Utf8.parse(password.slice(32, 48));
        const decrypted = AES.decrypt(lib.CipherParams.create({
            ciphertext: enc.Hex.parse(encrypted),
            formatter: format.Hex
        }), key, {
            iv: iv,
            mode: mode.CBC,
        })
        return decrypted.toString(enc.Hex);
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