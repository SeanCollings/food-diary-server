import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { DiaryDay, PrismaClient } from '@prisma/client';
import { TrendsService } from '@/trends/trends.service';
import { PrismaService } from '@/prisma.service';
import { getAllDatesForType } from '@/utils/modules/trends-utils';

jest.mock('@utils/modules/trends-utils', () => ({
  ...jest.requireActual('@utils/modules/trends-utils'),
  getAllDatesForType: jest.fn(),
}));

describe('TrendsService', () => {
  const mockUserId = 1234;
  const mockWeekDates = ['2023-04-26', '2023-04-27', '2023-04-28'];
  const mockMonthDates = [
    '2023-04-01',
    '2023-04-02',
    '2023-04-03',
    '2023-04-04',
    '2023-04-05',
  ];
  const mockDiaryDaysWeek: Partial<DiaryDay>[] = [
    {
      id: '1',
      userId: mockUserId,
      date: '2023-04-28',
      hasMealBreakfast: true,
      hasMealSnack1: true,
      hasMealDinner: true,
      wellnessWater: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '01:15',
      wellnessExcerciseDetails: 'mock exercise details',
    },
    {
      id: '2',
      userId: mockUserId,
      date: '2023-04-27',
      hasMealBreakfast: true,
      hasMealLunch: true,
      wellnessWater: 4,
      wellnessTeaCoffee: 2,
    },
  ];
  const mockDiaryDaysMonth: Partial<DiaryDay>[] = [
    {
      id: '1',
      userId: mockUserId,
      date: '2023-04-01',
      hasMealBreakfast: true,
      hasMealSnack1: true,
      hasMealLunch: true,
      hasMealSnack2: true,
      hasMealDinner: true,
      wellnessWater: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '01:15',
      wellnessExcerciseDetails: 'mock exercise details',
    },
    {
      id: '2',
      userId: mockUserId,
      date: '2023-04-02',
      hasMealBreakfast: true,
      hasMealLunch: true,
      wellnessWater: 4,
    },
    {
      id: '3',
      userId: mockUserId,
      date: '2023-04-04',
      hasMealBreakfast: true,
      hasMealSnack1: true,
      hasMealLunch: true,
      hasMealDinner: true,
      wellnessWater: 2,
      wellnessAlcohol: 0,
      wellnessExcercise: '00:30',
      wellnessExcerciseDetails: 'other mock excercise details',
    },
    {
      id: '4',
      userId: mockUserId,
      date: '2023-04-05',
      hasMealBreakfast: true,
      hasMealLunch: true,
      hasMealDinner: true,
      wellnessTeaCoffee: 3,
    },
  ];

  let service: TrendsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrendsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<TrendsService>(TrendsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMealTrends', () => {
    it('should get meal trends for a week', async () => {
      (getAllDatesForType as jest.Mock).mockReturnValue(mockWeekDates);

      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDaysWeek as any);
      const result = await service.getMealTrends(mockUserId, 'week');
      expect(result).toMatchSnapshot();
    });

    it('should get meal trends for a month', async () => {
      (getAllDatesForType as jest.Mock).mockReturnValue(mockMonthDates);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDaysMonth as any);

      const result = await service.getMealTrends(mockUserId, 'month');
      expect(result).toMatchSnapshot();
    });
  });

  describe('getBeverageTrends', () => {
    it('should get beverage trends for a week', async () => {
      (getAllDatesForType as jest.Mock).mockReturnValue(mockWeekDates);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDaysWeek as any);

      const result = await service.getBeverageTrends(mockUserId, 'week');
      expect(result).toMatchSnapshot();
    });

    it('should get beverage trends for a month', async () => {
      (getAllDatesForType as jest.Mock).mockReturnValue(mockMonthDates);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDaysMonth as any);

      const result = await service.getBeverageTrends(mockUserId, 'month');
      expect(result).toMatchSnapshot();
    });
  });

  describe('getExcerciseTrends', () => {
    it('should get excercise trends for a week', async () => {
      (getAllDatesForType as jest.Mock).mockReturnValue(mockWeekDates);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDaysWeek as any);

      const result = await service.getExcerciseTrends(mockUserId, 'week');
      expect(result).toMatchSnapshot();
    });

    it('should get excercise trends for a month', async () => {
      (getAllDatesForType as jest.Mock).mockReturnValue(mockMonthDates);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDaysMonth as any);

      const result = await service.getExcerciseTrends(mockUserId, 'month');
      expect(result).toMatchSnapshot();
    });
  });
});
