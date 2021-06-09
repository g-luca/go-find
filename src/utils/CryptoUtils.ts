import { createHash, createCipheriv, createDecipheriv, randomBytes } from "crypto"
export default class CryptoUtils {


    /**
     * Hash a string with SHA256
     * @param string message or string to hash
     * @returns Base64 hash result
     */
    public static sha256(string: string): string {
        return createHash('sha256').update(string).digest('hex');
    }

    public static randomString(n: number): string {
        return randomBytes(n).toString('hex');
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
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
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
        const decipher = createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = decipher.update(encrypted, 'hex', 'hex') + decipher.final('hex');
        return Buffer.from(decrypted, 'hex').toString('utf-8');
    }
}


//window['CryptoUtils'] = CryptoUtils;