import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsUserActiveGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isActive = await this.userService.isUserActive(user.id);
    if (isActive) {
      return true;
    }

    throw new ForbiddenException('This account is currently suspended');
  }
}
