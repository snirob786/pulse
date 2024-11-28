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
        if (Array.isArray(data?.data)) {
          payload = {
            list: data.data.map((item: any) => ({
              ...item,
              id: item.id,
              createdAt: item.createdAt?.toISOString(),
              updatedAt: item.updatedAt?.toISOString(),
            })),
          };
        } else if (typeof data?.data === 'object') {
          payload = {
            ...data.data,
            id: data.data.id,
            createdAt: data.data.createdAt?.toISOString(),
            updatedAt: data.data.updatedAt?.toISOString(),
          };
        } else {
          payload = data?.data;
        }
        let result: string = this.encryptionService.encrypt(payload);

        // Attach default response structure
        return {
          statusCode: response.statusCode || 200,
          success: true,
          message: data?.message || 'Request processed successfully',
          body: result,
        };
      }),
    );
  }
}
