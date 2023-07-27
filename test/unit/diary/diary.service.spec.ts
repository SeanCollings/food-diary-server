import { DiaryService } from '@/diary/diary.service';
import { MealContent } from '@/meals/types';
import { PrismaService } from '@/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiaryDay, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('DiaryService', () => {
  const mockUserId = 'mock_user_id';
  const mockDate = '2023-04-28';

  let service: DiaryService;
  let prisma: DeepMockProxy<PrismaClient>;

  const mockDiaryDays: Partial<DiaryDay>[] = [
    {
      id: '1',
      userId: mockUserId,
      date: mockDate,
      hasMealBreakfast: true,
      hasMealSnack1: true,
      hasMealDinner: true,
      wellnessWater: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '01:15',
      wellnessExcerciseDetails: 'mock exercise details',
      mealBreakfast: [
        { id: '1', food: 'mock_food_1.1', description: 'mock_description_1.1' },
      ] as MealContent[] as any,
      mealSnack1: [
        { id: '2.1', food: 'mock_food_2.1' },
      ] as MealContent[] as any,
      mealDinner: [
        { id: '3.1', food: 'mock_food_3.1' },
      ] as MealContent[] as any,
    },
    {
      id: '2',
      userId: mockUserId,
      date: '2023-04-27',
      hasMealBreakfast: true,
      hasMealLunch: true,
      wellnessWater: 4,
      wellnessTeaCoffee: 2,
      mealBreakfast: [
        { id: '1.2', food: 'mock_food_1.2', serving: 'mock_serving_1.2' },
      ] as MealContent[] as any,
      mealDinner: [
        { id: '2.2', food: 'mock_food_2.2' },
      ] as MealContent[] as any,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(DiaryService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDiaryEntries', () => {
    it('should get diary entries for a specified date', async () => {
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDays as any);

      const result = await service.getDiaryEntries(mockUserId, mockDate);

      expect(result).toMatchSnapshot();
    });

    it('should cater for no diary-day for specified date', async () => {
      prisma.diaryDay.findMany.mockResolvedValue([]);

      const result = await service.getDiaryEntries(mockUserId, mockDate);

      expect(result).toMatchSnapshot();
    });
  });

  describe('getCalendarEntries', () => {
    it('should get calendar entries for a date and number of months back', async () => {
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDays as any);

      const result = await service.getCalendarEntries(
        mockUserId,
        mockDate,
        '3',
      );

      expect(result).toMatchSnapshot();
    });

    it('should cater for no diary-days returned', async () => {
      prisma.diaryDay.findMany.mockResolvedValue([]);

      const result = await service.getCalendarEntries(
        mockUserId,
        mockDate,
        '3',
      );

      expect(result).toMatchSnapshot();
    });
  });
});
