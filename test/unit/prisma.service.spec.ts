import { PrismaService } from '@/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

describe('PrismaService', () => {
  let service: PrismaService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    app = module.createNestApplication();
    service = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enableShutdownHooks', () => {
    it('should call $on and successfully close the app', async () => {
      jest
        .spyOn(service, '$on')
        .mockImplementation(async (eventType, cb) =>
          cb(() => Promise.resolve()),
        );

      await service.enableShutdownHooks(app);

      expect(service.$on).toBeCalledTimes(1);
    });
  });
});
