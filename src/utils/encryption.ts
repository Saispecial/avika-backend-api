import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.DB_ENCRYPTION_KEY || 'default-encryption-key-32-chars'; // Ensure this is a 32-byte (256-bit) key

/**
 * Encrypts text using AES-256-CBC
 * @param text The text to encrypt
 * @returns The encrypted text
 */
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypts text using AES-256-CBC
 * @param text The text to decrypt
 * @returns The decrypted text
 */
export const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};


