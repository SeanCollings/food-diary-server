import { Test, TestingModule } from '@nestjs/testing';
import { MealsService } from '@/meals/meals.service';
import { MealsController } from '@/meals/meals.controller';
import { RequestWithUser } from '@/meals/types';
import { CreateMealItemDTO } from '@/meals/dtos/create-meal-item.dto';
import { UpdateMealItemDto } from '@/meals/dtos/update-meal-item.dto';
import { DeleteMealItemDto } from '@/meals/dtos/delete-meal-item.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

const mockError = jest.fn();

describe('MealsController', () => {
  const mockUser = {
    user: { userId: 'mock_user_id', email: 'test@email.com' },
  } as RequestWithUser;
  const mockCreateMealItemDto: CreateMealItemDTO = {
    mealId: 'breakfast',
    content: {
      id: '1',
      food: 'mock_food',
      description: 'mock_description',
      measurement: 'mock_measurement',
      serving: 'mock_serving',
      emoji: { name: 'mock_emoji_name', nativeSkin: 'mock_emoji_native_skin' },
    },
  };
  const mockUpdateMealItemDto: UpdateMealItemDto = {
    ...mockCreateMealItemDto,
    oldMealId: 'breakfast',
    newMealId: 'dinner',
  };
  const mockDeleteMealItemDto: DeleteMealItemDto = {
    id: '1',
    mealId: 'breakfast',
  };

  let controller: MealsController;
  let mealsServiceMock: jest.Mocked<Partial<MealsService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    mealsServiceMock = {
      createMealEntry: jest.fn(),
      deleteMealEntry: jest.fn(),
      updateMealEntry: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealsController],
      providers: [{ provide: MealsService, useValue: mealsServiceMock }],
    }).compile();

    controller = module.get<MealsController>(MealsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post / ', () => {
    it('should create a meal entry', async () => {
      await controller.createMealEntry(
        mockUser,
        { date: '2023-04-13' },
        mockCreateMealItemDto,
      );

      expect(mealsServiceMock.createMealEntry).toBeCalledWith(
        'mock_user_id',
        '2023-04-13',
        mockCreateMealItemDto,
      );
    });

    it('should handle errors', async () => {
      mealsServiceMock.createMealEntry = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.createMealEntry(
          mockUser,
          { date: '2023-04-13' },
          mockCreateMealItemDto,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[meals::_post_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      mealsServiceMock.createMealEntry = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.createMealEntry(
          mockUser,
          { date: '2023-04-13' },
          mockCreateMealItemDto,
        );
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[meals::_post_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('put / ', () => {
    it('should update a meal entry', async () => {
      await controller.updateMealEntry(
        mockUser,
        { date: '2023-04-13' },
        mockUpdateMealItemDto,
      );

      expect(mealsServiceMock.updateMealEntry).toBeCalledWith(
        'mock_user_id',
        '2023-04-13',
        mockUpdateMealItemDto,
      );
    });

    it('should handle errors', async () => {
      mealsServiceMock.updateMealEntry = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.updateMealEntry(
          mockUser,
          { date: '2023-04-13' },
          mockUpdateMealItemDto,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[meals::_put_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      mealsServiceMock.updateMealEntry = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.updateMealEntry(
          mockUser,
          { date: '2023-04-13' },
          mockUpdateMealItemDto,
        );
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[meals::_put_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('delete / ', () => {
    it('should delete a meal entry', async () => {
      await controller.deleteMealEntry(
        mockUser,
        { date: '2023-04-13' },
        mockDeleteMealItemDto,
      );

      expect(mealsServiceMock.deleteMealEntry).toBeCalledWith(
        'mock_user_id',
        '2023-04-13',
        mockDeleteMealItemDto,
      );
    });

    it('should handle errors', async () => {
      mealsServiceMock.deleteMealEntry = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.deleteMealEntry(
          mockUser,
          { date: '2023-04-13' },
          mockDeleteMealItemDto,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[meals::_delete_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      mealsServiceMock.deleteMealEntry = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.deleteMealEntry(
          mockUser,
          { date: '2023-04-13' },
          mockDeleteMealItemDto,
        );
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[meals::_delete_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
