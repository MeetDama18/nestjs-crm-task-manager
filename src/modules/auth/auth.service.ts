import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Registration endpoint logic
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  // 2. Login endpoint logic
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Fetch the user including their password hash
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare plain password with stored bcrypt hash
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Define the token payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Return the signed token
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}