import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  // Method to encrypt the payload with JWT
  encrypt(payload: any): string {
    try {
      // Sign the payload with JWT
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'theSRNirob',
        expiresIn: process.env.JWT_EXPIRATION_RESPONE || '1h', // Set expiration time
      });
      console.log('🚀 ~ EncryptionService ~ encrypt ~ token:', token);

      return token; // Return the signed JWT token
    } catch (error) {
      throw new Error(`Failed to encrypt payload: ${error.message}`);
    }
  }

  // Method to decrypt/verify JWT
  decrypt(token: string): any {
    try {
      // Verify the token and decode the payload
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'theSRNirob',
      });

      return decoded; // Return the decoded payload
    } catch (error) {
      throw new Error(`Failed to decrypt token: ${error.message}`);
    }
  }
}
