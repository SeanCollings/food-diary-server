import { Test, TestingModule } from '@nestjs/testing';
import { ShareController } from '@/share/share.controller';
import { ShareService } from '@/share/share.service';
import { RequestWithUser } from '@/share/types';
import { InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

describe('ShareController', () => {
  const mockError = jest.fn();
  let controller: ShareController;
  let shareServiceMock: jest.Mocked<Partial<ShareService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    shareServiceMock = {
      getSharedSummary: jest.fn(),
      generateShareLink: jest.fn(),
      linkShareable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShareController],
      providers: [{ provide: ShareService, useValue: shareServiceMock }],
    }).compile();

    controller = module.get<ShareController>(ShareController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get /', () => {
    it('should get shared-summary', async () => {
      await controller.getSharedSummary({
        link: 'mock_link',
        dateFrom: '2023-04-13',
        dateTo: '2022-01-02',
      });
      expect(shareServiceMock.getSharedSummary).toBeCalledWith(
        'mock_link',
        '2023-04-13',
        '2022-01-02',
      );
    });

    it('should handle errors', async () => {
      shareServiceMock.getSharedSummary = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getSharedSummary({
          link: 'mock_link',
          dateFrom: '2023-04-13',
          dateTo: '2022-01-02',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[share::_get_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      shareServiceMock.getSharedSummary = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getSharedSummary({
          link: 'mock_link',
          dateFrom: '2023-04-13',
          dateTo: '2022-01-02',
        });
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[share::_get_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('put /generate-link', () => {
    it('should return a share-link', async () => {
      await controller.generateShareLink({
        user: { userId: 1234, email: 'test@email.com' },
      } as RequestWithUser);

      expect(shareServiceMock.generateShareLink).toBeCalledWith(1234);
    });

    it('should handle errors', async () => {
      shareServiceMock.generateShareLink = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.generateShareLink({
          user: { userId: 1234, email: 'test@email.com' },
        } as RequestWithUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[share::_put_generate-link]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      shareServiceMock.generateShareLink = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.generateShareLink({
          user: { userId: 1234, email: 'test@email.com' },
        } as RequestWithUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[share::_put_generate-link]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('put /link-shareable', () => {
    it('should toggle a link as shareable', async () => {
      await controller.linkShareable(
        {
          user: { userId: 1234, email: 'test@email.com' },
        } as RequestWithUser,
        { isShared: true },
      );

      expect(shareServiceMock.linkShareable).toBeCalledWith(1234, true);
    });

    it('should handle errors', async () => {
      shareServiceMock.linkShareable = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.linkShareable(
          {
            user: { userId: 1234, email: 'test@email.com' },
          } as RequestWithUser,
          { isShared: true },
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[share::_put_link-shareable]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      shareServiceMock.linkShareable = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.linkShareable(
          {
            user: { userId: 1234, email: 'test@email.com' },
          } as RequestWithUser,
          { isShared: true },
        );
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[share::_put_link-shareable]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
