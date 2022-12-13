import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { MealsController } from '@/meals/meals.controller';
import { MealsService } from '@/meals/meals.service';
import { UsersService } from '@/users/users.service';

@Module({
  controllers: [MealsController],
  providers: [MealsService, PrismaService, UsersService],
})
export class MealsModule {}
