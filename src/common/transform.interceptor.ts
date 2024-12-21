import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  body: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TResponse<T>>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TResponse<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data: any) => {
        let payload: any = {};
        let token: string | undefined;

        console.log('🚀 ~ map ~ typeof data:', Array.isArray(data));
        if (Array.isArray(data)) {
          console.log('payload used 2');
          payload = {
            list: data,
          };
        } else if (typeof data === 'object') {
          // If the data contains a token, exclude it from encryption
          console.log('payload used 1');
          token = data.token;
          payload = data;
        } else {
          console.log('payload used 3');
          payload = data;
        }
        console.log('🚀 ~ map ~ payload:', payload);

        let encryptedPayload = this.encryptionService.encrypt(payload);
        console.log('🚀 ~ map ~ encryptedPayload:', encryptedPayload);

        // Attach the token back to the response (if applicable)

        // Attach default response structure
        return {
          statusCode: response.statusCode || 200,
          success: true,
          message: data?.message || 'Request processed successfully',
          body: encryptedPayload, // Encrypt the payload, keep token plain
        };
      }),
    );
  }
}
