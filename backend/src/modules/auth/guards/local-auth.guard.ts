import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean
    const req = context.switchToHttp().getRequest()
    console.log({req})
    // await super.logIn(req)
    return result;
  }

  // handleRequest(err, user, info) {
  //   console.log({err, user, info})
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
