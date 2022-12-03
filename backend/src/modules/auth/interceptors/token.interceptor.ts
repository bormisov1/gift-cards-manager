import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { IUser } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<IUser>,
  ): Observable<IUser> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.authService.signToken(user);

        response.setHeader('Authorization', `Bearer ${token}`);
        response.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        // response.cookie('token', token, {
        //   httpOnly: true,
        //   signed: true,
        //   sameSite: 'strict',
        //   secure: process.env.NODE_ENV === 'production',
        // });

        return user;
      }),
    );
  }
}
