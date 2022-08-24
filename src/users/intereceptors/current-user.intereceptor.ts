import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { handleRetry } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserIntereceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session;

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentuser = user;
    }

    return next.handle();
  }
}
