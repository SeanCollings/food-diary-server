import { PrismaService } from '@/prisma.service';
import { SummaryService } from '@/summary/summary.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiaryDay, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('SummaryService', () => {
  let service: SummaryService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummaryService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(SummaryService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserSummary', () => {
    it('should return a user summary', async () => {
      prisma.diaryDay.findMany.mockResolvedValue([
        {
          id: 1,
          userId: 1234,
          date: '2023-04-12T22:00:00.000Z',
          mealBreakfast: [{ food: 'food_1' }] as any,
          mealSnack1: [{ food: 'food_2' }] as any,
          mealLunch: [{ food: 'food_3' }] as any,
          mealSnack2: [{ food: 'food_4' }] as any,
          mealDinner: undefined as any,
          wellnessWater: 0,
        },
      ] as DiaryDay[]);

      const result = await service.getUserSummary(
        1234,
        '2023-04-12T22:00:00.000Z',
        '2023-04-11T22:00:00.000Z',
      );

      expect(result).toMatchSnapshot();
    });
  });
});
