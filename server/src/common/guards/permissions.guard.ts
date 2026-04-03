import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserService } from '../../user/user.service';

interface RequestWithUser extends Request {
  user?: { userId?: number | string; id?: number | string };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true; // 没有配置 @Permissions 的接口不需要校验权限
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || (!user.userId && !user.id)) {
      throw new ForbiddenException('未登录或 Token 无效');
    }

    const userId = user.userId ?? user.id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const userPermissions = await this.userService.getUserPermissions(
      Number(userId),
    );

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('权限不足，禁止访问');
    }

    return true;
  }
}
