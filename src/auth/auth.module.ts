import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants, SIGN_OPTION_EXPIRES_IN } from '@/auth/auth.constants';
import { LocalStrategy } from '@/auth/local.strategy';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma.service';
import { GoogleAdapter } from './adapter/google.adapter';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({ timeout: 2000 }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtContants.secret,
      signOptions: { expiresIn: SIGN_OPTION_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersService,
    PrismaService,
    GoogleAdapter,
  ],
  exports: [AuthService],
})
export class AuthModule {}
