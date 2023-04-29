import { PrismaService } from '@/prisma.service';
import { UserWithShareLink } from '@/users/types';
import { UsersService } from '@/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiaryDay, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('@/utils/date-utils', () => ({
  ...jest.requireActual('@/utils/date-utils'),
  setDaysFromDate: jest.fn().mockReturnValue('2023-04-26T22:00:00.000Z'),
}));

describe('UsersService', () => {
  const mockUserId = 1234;
  const mockDate = '2023-04-27T22:00:00.000Z';
  let service: UsersService;
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
    },
    {
      id: '2',
      userId: mockUserId,
      date: '2023-04-26T22:00:00.000Z',
      hasMealBreakfast: true,
      hasMealLunch: true,
      wellnessWater: 4,
      wellnessTeaCoffee: 2,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a single user by email', async () => {
      prisma.user.findUnique.mockResolvedValue({
        email: 'test@email.com',
      } as any);

      const result = await service.findOne('test@email.com');
      expect(result).toEqual({
        email: 'test@email.com',
      });
    });
  });

  describe('findOneSelect', () => {
    it('should get a user and return selected fields', async () => {
      prisma.user.findUnique.mockResolvedValue({
        name: 'test',
        email: 'test@email.com',
      } as any);

      const result = await service.findOneSelect(1234, {
        name: true,
        email: true,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          select: {
            name: true,
            email: true,
          },
        }),
      );
      expect(result).toEqual({
        name: 'test',
        email: 'test@email.com',
      });
    });

    it('should cater for no select given', async () => {
      prisma.user.findUnique.mockResolvedValue({} as any);

      await service.findOneSelect(1234);
      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          select: {},
        }),
      );
    });
  });

  describe('getUserProfile', () => {
    const userWithShareLink: Partial<UserWithShareLink> = {
      name: 'Mock Name',
      email: 'test@email.com',
      statLastActivity: new Date(mockDate),
      statDayStreak: 4,
      userPreferenceShowDayStreak: true,
      shareLink: {
        isShared: true,
        link: 'mock_sharelink',
      },
    };

    it('should ', async () => {
      prisma.user.findUnique.mockResolvedValue(userWithShareLink as any);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDays as any);

      const result = await service.getUserProfile(1234);

      expect(result).toMatchSnapshot();
    });
  });
});
