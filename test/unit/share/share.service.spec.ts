import { Test, TestingModule } from '@nestjs/testing';
import { ShareService } from '@/share/share.service';
import { PrismaService } from '@/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Prisma, PrismaClient } from '@prisma/client';

jest.mock('@/utils/string-utils', () => ({
  createGuid: jest.fn().mockReturnValue('mock_guid'),
}));

describe('ShareService', () => {
  const mockUserId = 'mock_user_id';
  let service: ShareService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(ShareService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSharedSummary', () => {
    it('should return a shared summary', async () => {
      prisma.shareLink.findFirst.mockResolvedValue({
        id: 1,
        isShared: true,
        link: 'share_link',
        userId: mockUserId,
        user: { name: 'Test User' },
      } as any);
      prisma.diaryDay.findMany.mockResolvedValue([]);

      const result = await service.getSharedSummary(
        'mock_link',
        '2023-04-02',
        '2023-04-13',
      );

      expect(result).toMatchSnapshot();
    });

    it('should throw error if no shareLink exists', async () => {
      prisma.shareLink.findFirst.mockResolvedValue(undefined as any);

      try {
        await service.getSharedSummary('mock_link', '2023-04-02', '2023-04-13');
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(
          `"Share page with link: mock_link does not exist"`,
        );
      }
    });
  });

  describe('generateShareLink', () => {
    it('should create and return a share-link', async () => {
      prisma.shareLink.upsert.mockResolvedValue({} as any);

      const result = await service.generateShareLink(mockUserId);

      expect(result).toMatchInlineSnapshot(`
        {
          "shareLink": "mock_guid",
        }
      `);
    });

    it('should handle errors', async () => {
      prisma.shareLink.upsert.mockRejectedValue({ message: 'Error occurred' });

      try {
        await service.generateShareLink(mockUserId);
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(`"Error occurred"`);
      }
    });

    it('should handle Prisma.PrismaClientKnownRequestErrors with code P2002', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Error occurred', {
        code: 'P2002',
        clientVersion: 'v1',
      });
      prisma.shareLink.upsert.mockRejectedValue(error);

      try {
        await service.generateShareLink(mockUserId);
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(
          `"There is a unique constraint violation, a new ShareLink cannot be created with this userid"`,
        );
      }
    });

    it('should handle Prisma.PrismaClientKnownRequestErrors that is not code P2002', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Error occurred', {
        code: 'Other',
        clientVersion: 'v1',
      });
      prisma.shareLink.upsert.mockRejectedValue(error);

      try {
        await service.generateShareLink(mockUserId);
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(`"Error occurred"`);
      }
    });
  });

  describe('linkShareable', () => {
    it('should update a sharelink shareability and return that shareLink', async () => {
      prisma.shareLink.update.mockResolvedValue({
        id: 'mock_share_id',
        userId: mockUserId,
        isShared: true,
        link: 'mock_link',
      });

      const result = await service.linkShareable(mockUserId, true);
      expect(result).toMatchInlineSnapshot(`
        {
          "id": "mock_share_id",
          "isShared": true,
          "link": "mock_link",
          "userId": "mock_user_id",
        }
      `);
    });
  });
});
