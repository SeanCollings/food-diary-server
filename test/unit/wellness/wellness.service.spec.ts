import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { isDateInFuture } from '@/utils/date-utils';
import { WellnessEntry } from '@/wellness/dtos/wellness-entry.dto';
import { WellnessService } from '@/wellness/wellness.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('@/utils/date-utils', () => ({
  ...jest.requireActual('@/utils/date-utils'),
  isDateInFuture: jest.fn(),
}));

describe('WellnessService', () => {
  const mockUserId = 'mock_user_id';
  let wellnessService: WellnessService;
  let prisma: DeepMockProxy<PrismaClient>;

  const mockUsersService: jest.Mocked<Partial<UsersService>> = {
    updateUserStreak: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WellnessService, UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    wellnessService = module.get(WellnessService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(wellnessService).toBeDefined();
  });

  describe('updateWellnessEntries', () => {
    const mockEntry: WellnessEntry = { date: '2023-04-13' };
    const mockEntries: WellnessEntry[] = [
      { date: '2023-04-13' },
      { date: '2023-04-12' },
      { date: '2023-04-11' },
    ];

    it('should update a single wellness entry and user streak', async () => {
      prisma.diaryDay.upsert.mockResolvedValue({ id: '1' } as any);
      (isDateInFuture as jest.Mock).mockReturnValue(false);

      await wellnessService.updateWellnessEntries(mockUserId, [mockEntry]);

      expect(prisma.diaryDay.upsert).toHaveBeenCalledTimes(1);
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should update multiple wellness entries and user streak', async () => {
      prisma.diaryDay.upsert.mockResolvedValue({ id: '1' } as any);
      (isDateInFuture as jest.Mock).mockReturnValue(false);

      await wellnessService.updateWellnessEntries(mockUserId, mockEntries);

      expect(prisma.diaryDay.upsert).toHaveBeenCalledTimes(3);
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledTimes(1);
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should update user streak if at least 1 entry is updated and throw error if 1 fails', async () => {
      (isDateInFuture as jest.Mock).mockReturnValue(false);
      prisma.diaryDay.upsert
        .mockResolvedValueOnce({ id: '1' } as any)
        .mockRejectedValueOnce('Error 1 occurred')
        .mockRejectedValueOnce('Error 2 occurred');

      try {
        await wellnessService.updateWellnessEntries(mockUserId, mockEntries);
      } catch (err) {
        expect(prisma.diaryDay.upsert).toHaveBeenCalledTimes(3);
        expect(mockUsersService.updateUserStreak).toHaveBeenCalledTimes(1);
        expect(err.message).toMatchInlineSnapshot(`"Error 1 occurred"`);
      }
    });

    it('should not update entry nor streak if date in future', async () => {
      (isDateInFuture as jest.Mock).mockReturnValue(true);

      await wellnessService.updateWellnessEntries(mockUserId, [mockEntry]);

      expect(prisma.diaryDay.upsert).not.toHaveBeenCalled();
      expect(mockUsersService.updateUserStreak).not.toHaveBeenCalled();
    });

    it('should not update entries nor streak if all dates in future', async () => {
      (isDateInFuture as jest.Mock).mockReturnValue(true);

      await wellnessService.updateWellnessEntries(mockUserId, mockEntries);

      expect(prisma.diaryDay.upsert).not.toHaveBeenCalled();
      expect(mockUsersService.updateUserStreak).not.toHaveBeenCalled();
    });

    it('should not update user streak if upsert fails and throw error', async () => {
      prisma.diaryDay.upsert.mockRejectedValue('Error occurred');
      (isDateInFuture as jest.Mock).mockReturnValue(false);

      try {
        await wellnessService.updateWellnessEntries(mockUserId, [mockEntry]);
      } catch (err) {
        expect(prisma.diaryDay.upsert).toHaveBeenCalled();
        expect(mockUsersService.updateUserStreak).not.toHaveBeenCalled();
        expect(err.message).toMatchInlineSnapshot(`"Error occurred"`);
      }
    });
  });
});
