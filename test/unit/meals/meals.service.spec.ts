import { CreateMealItemDTO } from '@/meals/dtos/create-meal-item.dto';
import { DeleteMealItemDto } from '@/meals/dtos/delete-meal-item.dto';
import { UpdateMealItemDto } from '@/meals/dtos/update-meal-item.dto';
import { MealsService } from '@/meals/meals.service';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiaryDay, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('@/utils/date-utils', () => ({
  ...jest.requireActual('@/utils/date-utils'),
  formatToServerDate: jest.fn().mockReturnValue('2023-04-13'),
}));

describe('MealsService', () => {
  const mockUserId = 'mock_user_id';
  const mockDate = '2023-04-13';
  const mockCreateMealItemDto: CreateMealItemDTO = {
    mealId: 'breakfast',
    content: {
      id: '2',
      food: 'mock_food_2',
      description: 'mock_description_2',
      measurement: 'mock_measurement_2',
      serving: 'mock_serving_2',
      emoji: {
        name: 'mock_emoji_name_2',
        nativeSkin: 'mock_emoji_native_skin_2',
      },
    },
  };
  const mockOtherTypeCreateDto: CreateMealItemDTO = {
    mealId: 'dinner',
    content: {
      id: '3',
      food: 'other_food_type_3',
      description: 'other_food_description_2',
    },
  };

  const mockDiaryDayResult: Partial<DiaryDay> = {
    id: '1',
    date: mockDate,
    userId: mockUserId,
    mealBreakfast: [
      { id: '1', food: 'mock_food_1', description: 'mock_description_2' },
    ],
    hasMealBreakfast: true,
  };

  let service: MealsService;
  let prisma: DeepMockProxy<PrismaClient>;

  const mockUsersService: jest.Mocked<Partial<UsersService>> = {
    updateUserStreak: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealsService, UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    service = module.get<MealsService>(MealsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMealEntry', () => {
    it('should create a new meal entry and update user streak when there is no current diary entry', async () => {
      prisma.diaryDay.findUnique.mockResolvedValue(null);
      prisma.diaryDay.upsert.mockResolvedValue({} as any);

      await service.createMealEntry(
        mockUserId,
        mockDate,
        mockCreateMealItemDto,
      );

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.upsert.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should update current meal entry type if exists and update user streak', async () => {
      prisma.diaryDay.findUnique.mockResolvedValue(mockDiaryDayResult as any);
      prisma.diaryDay.upsert.mockResolvedValue({} as any);

      await service.createMealEntry(
        mockUserId,
        mockDate,
        mockCreateMealItemDto,
      );

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.upsert.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should create new meal entry if type doesnt exist but diary day entry does', async () => {
      prisma.diaryDay.findUnique.mockResolvedValue(mockDiaryDayResult as any);
      prisma.diaryDay.upsert.mockResolvedValue({} as any);

      await service.createMealEntry(
        mockUserId,
        mockDate,
        mockOtherTypeCreateDto,
      );

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.upsert.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('updateMealEntry', () => {
    const mockUpdateMealItemDto: UpdateMealItemDto = {
      ...mockCreateMealItemDto,
      oldMealId: 'breakfast',
      newMealId: 'dinner',
    };
    const mockUpdateSameMealItemDto: UpdateMealItemDto = {
      ...mockCreateMealItemDto,
      oldMealId: 'breakfast',
      newMealId: 'breakfast',
    };
    const mockUpdateMealNoExist: UpdateMealItemDto = {
      ...mockCreateMealItemDto,
      oldMealId: 'snack_1',
      newMealId: 'snack_2',
    };

    beforeEach(() => {
      prisma.diaryDay.findUnique.mockResolvedValue(mockDiaryDayResult as any);
      prisma.diaryDay.update.mockResolvedValue({} as any);
    });

    it('should update a current meal contents to a new type', async () => {
      await service.updateMealEntry(
        mockUserId,
        mockDate,
        mockUpdateMealItemDto,
      );

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.update.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should update a current meal contents with new meal contents if meal types are the same', async () => {
      await service.updateMealEntry(
        mockUserId,
        mockDate,
        mockUpdateSameMealItemDto,
      );

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.update.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should cater for if current meal doesnt exist', async () => {
      await service.updateMealEntry(
        mockUserId,
        mockDate,
        mockUpdateMealNoExist,
      );

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.update.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should cater for diary-day not existing and not update', async () => {
      prisma.diaryDay.findUnique.mockResolvedValue(null);

      await service.updateMealEntry(
        mockUserId,
        mockDate,
        mockUpdateMealItemDto,
      );

      expect(prisma.diaryDay.update).not.toBeCalled();
      expect(mockUsersService.updateUserStreak).not.toBeCalled();
    });
  });

  describe('deleteMealEntry', () => {
    const deleteDto: DeleteMealItemDto = {
      id: '1',
      mealId: 'breakfast',
    };
    const deleteNoIdDto: DeleteMealItemDto = {
      id: '1000000',
      mealId: 'breakfast',
    };
    const deleteNoTypeDto: DeleteMealItemDto = {
      id: '1',
      mealId: 'snack_1',
    };

    beforeEach(() => {
      prisma.diaryDay.findUnique.mockResolvedValue(mockDiaryDayResult as any);
      prisma.diaryDay.update.mockResolvedValue({} as any);
    });

    it('should remove a meal by id from current meals', async () => {
      await service.deleteMealEntry(mockUserId, mockDate, deleteDto);

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.update.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should cater for if trying to remove id that doesnt exist', async () => {
      await service.deleteMealEntry(mockUserId, mockDate, deleteNoIdDto);

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.update.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should cater for if trying to remove meal-type that doesnt exist', async () => {
      await service.deleteMealEntry(mockUserId, mockDate, deleteNoTypeDto);

      expect(prisma.diaryDay.findUnique).toHaveBeenCalled();
      expect(prisma.diaryDay.update.mock.calls[0][0]).toMatchSnapshot();
      expect(mockUsersService.updateUserStreak).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should cater for diary-day not existing and not update', async () => {
      prisma.diaryDay.findUnique.mockResolvedValue(null);

      await service.deleteMealEntry(mockUserId, mockDate, deleteDto);

      expect(prisma.diaryDay.update).not.toBeCalled();
      expect(mockUsersService.updateUserStreak).not.toBeCalled();
    });
  });
});
