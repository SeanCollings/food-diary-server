import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { Module } from '@nestjs/common';
import { WellnessController } from './wellness.controller';
import { WellnessService } from './wellness.service';

@Module({
  controllers: [WellnessController],
  providers: [WellnessService, PrismaService, UsersService],
})
export class WellnessModule {}
