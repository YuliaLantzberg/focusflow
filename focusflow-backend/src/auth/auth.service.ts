import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly saltRounds = 10;

  async signup(signupDto: SignupDto) {
    const user = await this.usersService.findByEmail(signupDto.email);
    if (user) {
      throw new BadRequestException('This email already in use');
    }
    const passwordHash = await bcrypt.hash(signupDto.password, this.saltRounds);

    const newUser = await this.usersService.createUser({
      email: signupDto.email,
      passwordHash,
      name: signupDto.name,
      timezone: signupDto.timezone,
    });

    return { id: newUser.id, email: newUser.email };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(
        'The email or password you entered is incorrect.',
      );
    }

    const isValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isValid)
      throw new UnauthorizedException(
        'The email or password you entered is incorrect.',
      );

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
