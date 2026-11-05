import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Any authenticated user can view their own profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  // Only admins can access this route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-only')
  getAdminDashboard(@CurrentUser() user: User) {
    return {
      message: 'Welcome to the admin dashboard!',
      admin: user.email,
    };
  }
}