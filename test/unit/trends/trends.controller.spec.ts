import { Test, TestingModule } from '@nestjs/testing';
import { TrendsService } from '@/trends/trends.service';
import { RequestWithUser } from '@/trends/types';
import { InternalServerErrorException } from '@nestjs/common';
import { TrendsController } from '@/trends/trends.controller';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

describe('TrendsController', () => {
  const mockError = jest.fn();
  let controller: TrendsController;
  let trendsServiceMock: jest.Mocked<Partial<TrendsService>>;

  const mockUserId = 'mock_user_id';
  const mockUser = {
    user: {
      email: 'test@email.com',
      userId: mockUserId,
    },
  } as RequestWithUser;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    trendsServiceMock = {
      getBeverageTrends: jest.fn(),
      getExcerciseTrends: jest.fn(),
      getMealTrends: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendsController],
      providers: [{ provide: TrendsService, useValue: trendsServiceMock }],
    }).compile();

    controller = module.get<TrendsController>(TrendsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get /meal-trends', () => {
    it('should get meal-trends for a week', async () => {
      await controller.getMealTrends(mockUser, { type: 'week' });
      expect(trendsServiceMock.getMealTrends).toHaveBeenCalledWith(
        mockUserId,
        'week',
      );
    });

    it('should get meal-trends for a month', async () => {
      await controller.getMealTrends(mockUser, { type: 'month' });
      expect(trendsServiceMock.getMealTrends).toHaveBeenCalledWith(
        mockUserId,
        'month',
      );
    });

    it('should handle errors', async () => {
      trendsServiceMock.getMealTrends = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getMealTrends(mockUser, { type: 'week' });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[trends::_get_meal-trends]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      trendsServiceMock.getMealTrends = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getMealTrends(mockUser, { type: 'week' });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[trends::_get_meal-trends]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('get /beverage-trends', () => {
    it('should get beverage-trends for a week', async () => {
      await controller.getBeverageTrends(mockUser, { type: 'week' });
      expect(trendsServiceMock.getBeverageTrends).toHaveBeenCalledWith(
        mockUserId,
        'week',
      );
    });

    it('should get beverage-trends for a month', async () => {
      await controller.getBeverageTrends(mockUser, { type: 'month' });
      expect(trendsServiceMock.getBeverageTrends).toHaveBeenCalledWith(
        mockUserId,
        'month',
      );
    });

    it('should handle errors', async () => {
      trendsServiceMock.getBeverageTrends = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getBeverageTrends(mockUser, { type: 'week' });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[trends::_get_beverage-trends]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      trendsServiceMock.getBeverageTrends = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getBeverageTrends(mockUser, { type: 'week' });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[trends::_get_beverage-trends]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('get /excercise-trends', () => {
    it('should get excercise-trends for a week', async () => {
      await controller.getExcerciseTrends(mockUser, { type: 'week' });
      expect(trendsServiceMock.getExcerciseTrends).toHaveBeenCalledWith(
        mockUserId,
        'week',
      );
    });
    it('should get excercise-trends for a month', async () => {
      await controller.getExcerciseTrends(mockUser, { type: 'month' });
      expect(trendsServiceMock.getExcerciseTrends).toHaveBeenCalledWith(
        mockUserId,
        'month',
      );
    });

    it('should handle errors', async () => {
      trendsServiceMock.getExcerciseTrends = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getExcerciseTrends(mockUser, { type: 'week' });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[trends::_get_excercise-trends]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      trendsServiceMock.getExcerciseTrends = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getExcerciseTrends(mockUser, { type: 'week' });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[trends::_get_excercise-trends]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
