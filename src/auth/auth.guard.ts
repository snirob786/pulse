import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service'; // Assuming you have a UserService to fetch user details
import { JwtPayload } from 'jsonwebtoken'; // Same as in Express code

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // Your service for fetching users
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('You are not authorized!');
    }

    try {
      console.log('🚀 ~ AuthGuard ~ token:', process.env.JWT_SECRET);
      // Extract and verify JWT
      const decoded = this.jwtService.verify(token);
      console.log('🚀 ~ AuthGuard ~ decoded:', decoded);
      //   const decoded = this.jwtService.verify(token.replace('Bearer ', ''));

      const { role, sub, iat }: any = decoded as JwtPayload;

      if (!sub) {
        throw new UnauthorizedException('User ID is not valid!');
      }
      // Check if the user exists
      return this.userService.findById(sub).then((user) => {
        if (!user) {
          throw new NotFoundException('This user is not found!');
        }

        // if (user.isDeleted) {
        //   throw new ForbiddenException('This user is deleted!');
        // }

        // if (user.status === 'blocked') {
        //   throw new ForbiddenException('This user is blocked!');
        // }

        // if (user.passwordChangedAt && user.passwordChangedAt > iat) {
        //   throw new UnauthorizedException('You are not authorized!');
        // }

        // Add user info to request object for later access
        request.user = decoded;

        return true;
      });
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
