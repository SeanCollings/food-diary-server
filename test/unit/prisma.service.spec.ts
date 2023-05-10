import { PrismaService } from '@/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

const mockError = jest.fn();

describe('PrismaService', () => {
  let service: PrismaService;
  let app: INestApplication;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

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

  describe('onModuleInit', () => {
    it('should catch $connect errors', async () => {
      jest
        .spyOn(service, '$connect')
        .mockImplementation(() =>
          Promise.reject({ message: 'Something went wrong' }),
        );

      await service.onModuleInit();

      expect(mockError).toHaveBeenCalled();
    });
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
