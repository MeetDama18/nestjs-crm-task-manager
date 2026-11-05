import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// 1. Define the shape of data stored inside the decrypted JWT
export interface JwtPayload {
  sub: string;     // 'sub' is the standard JWT field for subject (User ID)
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Tell Passport to extract the Bearer token from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject expired tokens automatically
      ignoreExpiration: false,
      // The secret key used to verify the token signature
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  // 2. This method is called automatically once Passport verifies the token signature
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Whatever is returned here is accessible as req.user in controllers/guards
    return user;
  }
}