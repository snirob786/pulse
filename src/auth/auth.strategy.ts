import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Ensure the token isn't expired
      secretOrKey: process.env.JWT_SECRET, // Use the same secret as in JwtModule
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // Payload contains the user info (e.g., email, user ID)
    return { userId: payload.sub, email: payload.email };
  }
}
