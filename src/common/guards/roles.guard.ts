import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Read required roles attached to the route handler or controller class
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Checks the method
      context.getClass(),   // Checks the class (if whole controller is protected)
    ]);

    // 2. If no @Roles() decorator is present on this route, allow access
    if (!requiredRoles) {
      return true;
    }

    // 3. Extract the user attached by JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // 4. Verify user exists and has one of the required roles
    if (!user || !requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException(
        'Access denied: You do not have permission to access this resource',
      );
    }

    return true;
  }
}