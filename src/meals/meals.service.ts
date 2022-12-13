import { Injectable } from '@nestjs/common';
import {
  MealContent,
  CreateMealItemDTO,
} from '@/meals/dtos/create-meal-item.dto';
import { PrismaService } from '@/prisma.service';
import { MealTypes } from './types';
import { formatToServerDate } from '@/utils/date-utils';
import { UpdateMealItemDto } from './dtos/update-meal-item.dto';
import { DeleteMealItemDto } from './dtos/delete-meal-item.dto';
import { DiaryDay } from '@prisma/client';
import { UsersService } from '@/users/users.service';

const mealColumnNameLookup = (mealType: MealTypes) => {
  const lookup: { [key in MealTypes]: keyof DiaryDay } = {
    breakfast: 'mealBreakfast',
    snack_1: 'mealSnack1',
    lunch: 'mealLunch',
    snack_2: 'mealSnack2',
    dinner: 'mealDinner',
  };

  return lookup[mealType] as string;
};
const hasMealContentColumnLookup = (mealType: MealTypes) => {
  const lookup: {
    [key in MealTypes]: keyof Pick<
      DiaryDay,
      | 'hasMealBreakfast'
      | 'hasMealSnack1'
      | 'hasMealLunch'
      | 'hasMealSnack2'
      | 'hasMealDinner'
    >;
  } = {
    breakfast: 'hasMealBreakfast',
    snack_1: 'hasMealSnack1',
    lunch: 'hasMealLunch',
    snack_2: 'hasMealSnack2',
    dinner: 'hasMealDinner',
  };

  return lookup[mealType] as string;
};
const buildMealContent = (
  current: MealContent[] | null,
  newContent: CreateMealItemDTO | UpdateMealItemDto,
) => {
  if (!current?.length) {
    return [newContent.content];
  }

  return [...current, newContent.content];
};
const updateMealContent = ({
  content,
  currentMealColumnName,
  newMealColumnName,
  currentHasMealContentColumn,
  newHasMealContentColumn,
  currentMealContents,
  newMealContents,
}: {
  content: MealContent;
  currentMealColumnName: string;
  newMealColumnName: string;
  currentHasMealContentColumn: string;
  newHasMealContentColumn: string;
  currentMealContents: MealContent[] | null;
  newMealContents: MealContent[] | null;
}) => {
  const contentId = content.id;
  const contentIndex = currentMealContents?.findIndex(
    (meal) => meal.id === contentId,
  );

  if (newMealColumnName === currentMealColumnName) {
    const updatedMealContents = [...currentMealContents];
    updatedMealContents[contentIndex] = content;

    return { [currentMealColumnName]: updatedMealContents };
  }

  const updatedOldMealContents = (currentMealContents || [])?.filter(
    (content) => content.id !== contentId,
  );
  const updatedNewMealContents = [...newMealContents, content];

  return {
    [currentMealColumnName]: updatedOldMealContents,
    [currentHasMealContentColumn]: !!updatedOldMealContents?.length,
    [newMealColumnName]: updatedNewMealContents,
    [newHasMealContentColumn]: !!updatedNewMealContents?.length,
  };
};
const removeMealContent = (
  currentContent: MealContent[] | null,
  meal: DeleteMealItemDto,
) => {
  if (!currentContent?.length) {
    return [];
  }

  return currentContent.filter((content) => content.id !== meal.id);
};

@Injectable()
export class MealsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createMealEntry(userId: number, date: string, meal: CreateMealItemDTO) {
    const mealColumnName = mealColumnNameLookup(meal.mealId);
    const hasMealContentColumn = hasMealContentColumnLookup(meal.mealId);

    const currentDiaryDay = await this.prisma.diaryDay.findUnique({
      where: {
        userId_date: {
          date: formatToServerDate(date),
          userId,
        },
      },
    });

    const currentMealContent = currentDiaryDay?.[
      mealColumnName
    ] as MealContent[];
    const mealContent = buildMealContent(currentMealContent, meal);

    await this.prisma.diaryDay.upsert({
      where: {
        userId_date: {
          date: formatToServerDate(date),
          userId,
        },
      },
      create: {
        userId,
        date: formatToServerDate(date),
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
    const newMealColumnName = mealColumnNameLookup(meal.newMealId);
    const currentMealColumnName = mealColumnNameLookup(meal.oldMealId);
    const newHasMealContentColumn = hasMealContentColumnLookup(meal.newMealId);
    const currentHasMealContentColumn = hasMealContentColumnLookup(
      meal.oldMealId,
    );

    const currentDiaryDay = await this.prisma.diaryDay.findUnique({
      where: {
        userId_date: {
          date: formatToServerDate(date),
          userId,
        },
      },
    });

    const currentMealContents = currentDiaryDay?.[currentMealColumnName] as
      | MealContent[];
    const newMealContents = currentDiaryDay?.[newMealColumnName] as
      | MealContent[];
    const updatedContent = updateMealContent({
      newMealColumnName,
      currentMealColumnName,
      currentHasMealContentColumn,
      newHasMealContentColumn,
      content: meal.content,
      newMealContents,
      currentMealContents,
    });

    await this.prisma.diaryDay.update({
      where: {
        userId_date: {
          date: formatToServerDate(date),
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
    const mealColumnName = mealColumnNameLookup(meal.mealId);
    const hasMealContentColumn = hasMealContentColumnLookup(meal.mealId);

    const currentDiaryDay = await this.prisma.diaryDay.findUnique({
      where: {
        userId_date: {
          date: formatToServerDate(date),
          userId,
        },
      },
    });

    const currentMealContent = currentDiaryDay?.[mealColumnName] as
      | MealContent[];
    const updatedContent = removeMealContent(currentMealContent, meal);

    await this.prisma.diaryDay.update({
      where: {
        userId_date: {
          date: formatToServerDate(date),
          userId,
        },
      },
      data: {
        [mealColumnName]: updatedContent,
        [hasMealContentColumn]: !!updatedContent?.length,
      },
    });

    return this.usersService.updateUserStreak(userId);
  }
}
