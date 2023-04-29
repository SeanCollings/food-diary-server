import { Injectable } from '@nestjs/common';
import { CreateMealItemDTO } from '@/meals/dtos/create-meal-item.dto';
import { PrismaService } from '@/prisma.service';
import { formatToServerDate } from '@/utils/date-utils';
import { UpdateMealItemDto } from './dtos/update-meal-item.dto';
import { DeleteMealItemDto } from './dtos/delete-meal-item.dto';
import { UsersService } from '@/users/users.service';
import {
  buildMealContent,
  getMealContents,
  mealsColumnLookup,
  removeMealContent,
  updateMealContent,
} from '@/utils/modules/meals-utils';

@Injectable()
export class MealsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createMealEntry(userId: number, date: string, meal: CreateMealItemDTO) {
    const serverDate = formatToServerDate(date);
    const [mealColumnName, hasMealContentColumn] = mealsColumnLookup(
      meal.mealId,
    );

    const currentDiaryDay = await this.prisma.diaryDay.findUnique({
      where: {
        userId_date: {
          date: serverDate,
          userId,
        },
      },
    });

    const currentMealContent = getMealContents(currentDiaryDay, mealColumnName);
    const mealContent = buildMealContent(currentMealContent, meal);

    await this.prisma.diaryDay.upsert({
      where: {
        userId_date: {
          date: serverDate,
          userId,
        },
      },
      create: {
        userId,
        date: serverDate,
        [mealColumnName]: mealContent,
        [hasMealContentColumn]: true,
      },
      update: {
        [mealColumnName]: mealContent,
        [hasMealContentColumn]: true,
      },
    });

    return this.usersService.updateUserStreak(userId);
  }

  async updateMealEntry(userId: number, date: string, meal: UpdateMealItemDto) {
    const serverDate = formatToServerDate(date);
    const [newMealColumnName, newHasMealContentColumn] = mealsColumnLookup(
      meal.newMealId,
    );
    const [currentMealColumnName, currentHasMealContentColumn] =
      mealsColumnLookup(meal.oldMealId);

    const currentDiaryDay = await this.prisma.diaryDay.findUnique({
      where: {
        userId_date: {
          date: serverDate,
          userId,
        },
      },
    });

    if (!currentDiaryDay) {
      return;
    }

    const currentMealContents = getMealContents(
      currentDiaryDay,
      currentMealColumnName,
    );
    const newMealContents = getMealContents(currentDiaryDay, newMealColumnName);
    const updatedContent = updateMealContent({
      content: meal.content,
      currentMealColumnName,
      newMealColumnName,
      currentHasMealContentColumn,
      newHasMealContentColumn,
      newMealContents,
      currentMealContents,
    });

    await this.prisma.diaryDay.update({
      where: {
        userId_date: {
          date: serverDate,
          userId,
        },
      },
      data: {
        ...updatedContent,
      },
    });

    return this.usersService.updateUserStreak(userId);
  }

  async deleteMealEntry(userId: number, date: string, meal: DeleteMealItemDto) {
    const serverDate = formatToServerDate(date);
    const [mealColumnName, hasMealContentColumn] = mealsColumnLookup(
      meal.mealId,
    );

    const currentDiaryDay = await this.prisma.diaryDay.findUnique({
      where: {
        userId_date: {
          date: serverDate,
          userId,
        },
      },
    });

    if (!currentDiaryDay) {
      return;
    }

    const currentMealContent = getMealContents(currentDiaryDay, mealColumnName);
    const updatedContent = removeMealContent(currentMealContent, meal);

    await this.prisma.diaryDay.update({
      where: {
        userId_date: {
          date: serverDate,
          userId,
        },
      },
      data: {
        [mealColumnName]: updatedContent,
        [hasMealContentColumn]: !!updatedContent.length,
      },
    });

    return this.usersService.updateUserStreak(userId);
  }
}
