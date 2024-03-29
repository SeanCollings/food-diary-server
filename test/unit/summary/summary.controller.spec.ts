import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { SummaryController } from '@/summary/summary.controller';
import { SummaryService } from '@/summary/summary.service';
import { RequestWithUser } from '@/summary/types';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('SummaryController', () => {
  const mockError = jest.fn();
  let controller: SummaryController;
  let summaryServiceMock: jest.Mocked<Partial<SummaryService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    summaryServiceMock = {
      getUserSummary: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryController],
      providers: [{ provide: SummaryService, useValue: summaryServiceMock }],
    }).compile();

    controller = module.get<SummaryController>(SummaryController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get /', () => {
    const mockUser = {
      user: { userId: 'mock_user_id', email: 'test@email.com' },
    } as RequestWithUser;

    it('should get a user summary', async () => {
      await controller.getUserSummary(mockUser, {
        dateFrom: '2023-04-13',
        dateTo: '2022-01-02',
      });

      expect(summaryServiceMock.getUserSummary).toBeCalledWith(
        'mock_user_id',
        '2023-04-13',
        '2022-01-02',
      );
    });

    it('should handle errors', async () => {
      summaryServiceMock.getUserSummary = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getUserSummary(mockUser, {
          dateFrom: '2023-04-13',
          dateTo: '2022-01-02',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[summary::_get_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      summaryServiceMock.getUserSummary = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getUserSummary(mockUser, {
          dateFrom: '2023-04-13',
          dateTo: '2022-01-02',
        });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[summary::_get_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
