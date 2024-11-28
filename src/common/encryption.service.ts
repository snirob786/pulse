import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly secretKey =
    process.env.ENCRYPTION_KEY || 'mysecretkeymysecretkeymysecretke'; // AES-256 requires 32-byte key (256 bits)
  private readonly ivLength = 16; // AES block size for CBC mode (128 bits)

  // Method to encrypt the payload
  encrypt(payload: any): string {
    // Ensure the secret key is exactly 32 bytes (256 bits) for AES-256

    if (this.secretKey.length !== 64) {
      throw new Error('Encryption key must be 32 characters long for AES-256');
    }

    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(this.ivLength); // 16 bytes for AES-CBC

    // Create a cipher using AES-256-CBC
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.secretKey, 'hex'), // Ensure key is in raw binary format
      iv,
    );

    // Encrypt the payload
    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return IV and encrypted data combined, separated by a colon for later decryption
    return `${iv.toString('hex')}:${encrypted}`;
  }
}
