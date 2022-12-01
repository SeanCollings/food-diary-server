import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user) {
      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash === hash.toString('hex')) {
        return user;
      }
    }

    return null;
  }

  async signup({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    const user = await this.userService.findOne(email);

    if (user) {
      throw new BadRequestException('Email in use!');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return this.prisma.user.create({
      data: { email, name, password: result },
    });
  }

  async login(user: { email: string; id: number }) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
