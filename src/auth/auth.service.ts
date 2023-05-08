import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma.service';
import { GoogleAdapter } from './adapter/google.adapter';
import { CreateUserDTO, ResetPasswordDto } from './dtos';
import { dateNow } from '@/utils/date-utils';
import { SCRYPT_KEYLEN } from '@/auth/auth.constants';
import { isValidPassword } from '@/lib/validation/validate-user';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private googleAdapter: GoogleAdapter,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    return isValidPassword(user, password);
  }

  async signup({ email, name, password, token }: CreateUserDTO) {
    const isVerified = await this.googleAdapter.verifySite(token);

    if (!isVerified) {
      throw new Error('Something went wrong!');
    }

    const user = await this.userService.findOne(email);

    if (user) {
      throw new Error('Email in use!');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, SCRYPT_KEYLEN)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return this.prisma.user.create({
      data: { email, name, password: result },
    });
  }

  async login(args: { email: string; id: number; token: string }) {
    const isVerified = await this.googleAdapter.verifySite(args.token);

    if (!isVerified) {
      throw new Error('Something went wrong!');
    }

    await this.prisma.user.update({
      where: { id: args.id },
      data: { lastLogin: new Date(dateNow()) },
    });

    const payload = { email: args.email, sub: args.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(args: ResetPasswordDto) {
    const isVerified = await this.googleAdapter.verifySite(args.token);

    if (!isVerified) {
      throw new Error('Something went wrong!');
    }

    return { message: 'Reset link sent' };
  }
}
