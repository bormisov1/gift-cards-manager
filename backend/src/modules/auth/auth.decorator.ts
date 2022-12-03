import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { IAuthUser } from './auth.interface';

export const AuthUser = createParamDecorator(
  (data: keyof IAuthUser, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as IAuthUser;

    return data ? user && user[data] : user;
  },
);
