import { PrismaService } from '@/prisma.service';
import { UpdatePreferencesDTO, UpdateUserDTO } from '@/users/dtos';
import { UserWithShareLink } from '@/users/types';
import { UsersService } from '@/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiaryDay, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UsersService', () => {
  const mockUserId = 1234;
  const mockDateToday = '2023-04-28';
  const mockDateYesterday = '2023-04-27';
  let service: UsersService;
  let prisma: DeepMockProxy<PrismaClient>;

  const mockDiaryDays: Partial<DiaryDay>[] = [
    {
      id: '1',
      userId: mockUserId,
      date: mockDateToday,
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
      date: mockDateYesterday,
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
      statLastActivity: new Date(mockDateToday),
      statDayStreak: 4,
      userPreferenceShowDayStreak: true,
      shareLink: {
        isShared: true,
        link: 'mock_sharelink',
      },
    };

    it('should get user profile', async () => {
      prisma.user.findUnique.mockResolvedValue(userWithShareLink as any);
      prisma.diaryDay.findMany.mockResolvedValue(mockDiaryDays as any);

      const result = await service.getUserProfile(mockUserId);

      expect(result).toMatchSnapshot();
      expect(prisma.user.findUnique.mock.calls[0][0]).toMatchSnapshot();
      expect(prisma.diaryDay.findMany.mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('updateUser', () => {
    const mockUserUpdate: UpdateUserDTO = { name: 'Mock Name' };

    it('should update user', async () => {
      prisma.user.update.mockResolvedValue({} as any);
      await service.updateUser(1234, mockUserUpdate);
      expect(prisma.user.update.mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('updateUserPreferences', () => {
    const mockUserPreferences: UpdatePreferencesDTO = {
      showDayStreak: true,
      showWeeklyExcercise: true,
      showWeeklyWater: true,
    };

    it('should update users preferences', async () => {
      prisma.user.update.mockResolvedValue({} as any);

      await service.updateUserPreferences(mockUserId, mockUserPreferences);
      expect(prisma.user.update.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should update users preferences without preferences', async () => {
      await service.updateUserPreferences(mockUserId, {});
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('updateUserStreak', () => {
    it('should update a users streak if last activity date was yesterday', async () => {
      prisma.user.findUnique.mockResolvedValue({
        statLastActivity: new Date(mockDateYesterday),
        statDayStreak: 4,
      } as any);
      prisma.user.update.mockResolvedValue({} as any);

      await service.updateUserStreak(mockUserId);

      expect(prisma.user.findUnique).toBeCalledTimes(1);
      expect(prisma.user.update.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should not update a users streak if last activity date was today', async () => {
      prisma.user.findUnique.mockResolvedValue({
        statLastActivity: new Date(mockDateToday),
        statDayStreak: 4,
      } as any);
      prisma.user.update.mockResolvedValue({} as any);

      await service.updateUserStreak(mockUserId);

      expect(prisma.user.findUnique).toBeCalledTimes(1);
      expect(prisma.user.update).not.toBeCalled();
    });

    it('should cater for an undefined statDayStreak value', async () => {
      prisma.user.findUnique.mockResolvedValue({
        statLastActivity: new Date(mockDateYesterday),
      } as any);
      prisma.user.update.mockResolvedValue({} as any);

      await service.updateUserStreak(mockUserId);

      expect(prisma.user.findUnique).toBeCalledTimes(1);
      expect(prisma.user.update.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should cater for null found user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await service.updateUserStreak(mockUserId);

      expect(prisma.user.findUnique).toBeCalledTimes(1);
      expect(prisma.user.update).not.toBeCalled();
    });
  });
});
