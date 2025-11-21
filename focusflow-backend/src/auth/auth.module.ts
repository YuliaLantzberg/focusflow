// System and libraries modules
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

// Entities modules
import { UsersModule } from 'src/users/users.module';

// Services
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

// Controllers
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'dev-secret', // temporary
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule,
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
