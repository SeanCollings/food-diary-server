import { Test, TestingModule } from '@nestjs/testing';
import { WellnessController } from '@/wellness/wellness.controller';
import { WellnessService } from '@/wellness/wellness.service';
import { RequestWithUser } from '@/wellness/types';
import { InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

describe('WellnessController', () => {
  const mockError = jest.fn();
  let controller: WellnessController;
  let wellnessServiceMock: jest.Mocked<Partial<WellnessService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    wellnessServiceMock = {
      updateWellnessEntries: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WellnessController],
      providers: [{ provide: WellnessService, useValue: wellnessServiceMock }],
    }).compile();

    controller = module.get<WellnessController>(WellnessController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('put /', () => {
    const mockUser = {
      user: { userId: 'mock_user_id', email: 'test@email.com' },
    } as RequestWithUser;
    const mockData = [
      {
        date: '2023-04-13',
        water: { value: 2 },
        tea_coffee: { value: 2 },
        alcohol: { value: 2 },
        excercise: { time: '01:00', details: 'mock_details' },
      },
    ];

    it('should update wellness entries', async () => {
      await controller.updateWellnessEntries(mockUser, {
        data: mockData,
      });

      expect(wellnessServiceMock.updateWellnessEntries).toBeCalledWith(
        'mock_user_id',
        mockData,
      );
    });

    it('should handle errors', async () => {
      wellnessServiceMock.updateWellnessEntries = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.updateWellnessEntries(mockUser, {
          data: mockData,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[wellness::_put_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      wellnessServiceMock.updateWellnessEntries = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.updateWellnessEntries(mockUser, {
          data: mockData,
        });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[wellness::_put_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
