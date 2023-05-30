import { DiaryController } from '@/diary/diary.controller';
import { DiaryService } from '@/diary/diary.service';
import { RequestWithUser } from '@/diary/types';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

describe('DiaryController', () => {
  const mockError = jest.fn();
  const mockDate = '2023-04-28';
  const mockUserId = 1234;
  const mockUser = {
    user: { email: 'test@email.com', userId: mockUserId },
  } as RequestWithUser;

  let controller: DiaryController;
  let diaryServiceMock: jest.Mocked<Partial<DiaryService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    diaryServiceMock = {
      getCalendarEntries: jest.fn(),
      getDiaryEntries: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryController],
      providers: [{ provide: DiaryService, useValue: diaryServiceMock }],
    }).compile();

    controller = module.get<DiaryController>(DiaryController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get /', () => {
    it('should get diary entries for a given date', async () => {
      await controller.getDiaryEntries(mockUser, { date: mockDate });
      expect(diaryServiceMock.getDiaryEntries).toHaveBeenCalledWith(
        mockUserId,
        mockDate,
      );
    });

    it('should handle errors', async () => {
      diaryServiceMock.getDiaryEntries = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getDiaryEntries(mockUser, { date: mockDate });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[diary::_get_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      diaryServiceMock.getDiaryEntries = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getDiaryEntries(mockUser, { date: mockDate });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[diary::_get_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('get /calendar-entries', () => {
    it('should get calender-entries for a date and a number of months', async () => {
      await controller.getCalendarEntries(mockUser, {
        date: mockDate,
        months: '2',
      });
      expect(diaryServiceMock.getCalendarEntries).toHaveBeenCalledWith(
        mockUserId,
        mockDate,
        '2',
      );
    });

    it('should handle errors', async () => {
      diaryServiceMock.getCalendarEntries = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getCalendarEntries(mockUser, {
          date: mockDate,
          months: '2',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[diary::_get_calendar-entries]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      diaryServiceMock.getCalendarEntries = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getCalendarEntries(mockUser, {
          date: mockDate,
          months: '2',
        });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[diary::_get_calendar-entries]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
