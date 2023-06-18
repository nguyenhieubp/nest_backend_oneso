import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserService } from '../user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    try {
      const { headers } = context.switchToHttp().getRequest();
      const token = headers.authorization.split(' ')[1]; // Lấy phần token sau "Bearer"
      // Giải mã JWT để lấy thông tin người dùng
      const decodedToken: any = jwt.verify(token, 'secret');
      // Gán thông tin người dùng vào 'user' trong request
      const user = await this.userService.findUser(decodedToken.id); // Thay 'user' bằng tên trường chứa thông tin người dùng trong JWT

      return requiredRoles.some((role) => user.roles?.includes(role));
    } catch (error) {
      return false;
    }
  }
}
