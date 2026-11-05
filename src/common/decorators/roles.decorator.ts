import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// Key used by Reflector to locate the roles metadata
export const ROLES_KEY = 'roles';

// Decorator function that accepts one or more roles: @Roles(Role.ADMIN)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);