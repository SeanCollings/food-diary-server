import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SIGN_OPTION_EXPIRES_IN } from '@/auth/auth.constants';
import { LocalStrategy } from '@/auth/local.strategy';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma.service';
import { GoogleAdapter } from './adapter/google.adapter';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.register({ timeout: 2000 }),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: SIGN_OPTION_EXPIRES_IN },
        };
      },
      inject: [ConfigService],
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
