import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { GoogleAdapter } from '@/auth/adapter/google.adapter';
import { AuthModule } from '@/auth/auth.module';
import { ShareModule } from '@/share/share.module';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { isValidPassword } from '@/lib/validation/validate-user';
import { diaryDays_fixture, user_fixture } from '../__fixtures__';
import { mockLoginResponseBody } from '../e2e.setup';

jest.mock('@/lib/validation/validate-user');
jest.mock('@/utils/string-utils', () => ({
  ...jest.requireActual('@/utils/string-utils'),
  createGuid: jest.fn().mockReturnValue('mock_guid'),
}));

const mockError = jest.fn();

describe('ShareController (e2e)', () => {
  let app: INestApplication;
  let prisma: DeepMockProxy<PrismaClient>;
  let mockUsersService: jest.Mocked<Partial<UsersService>>;
  let mockGoogleAdapter: jest.Mocked<Partial<GoogleAdapter>>;

  const mockUUID = 'd9e28047-0ad5-4898-964d-7079f7a4a0ed';
  const mockShareLink = { userId: 1234, user: { name: 'Mock Name' } };

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
    };
    mockGoogleAdapter = {
      verifySite: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, ShareModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(GoogleAdapter)
      .useValue(mockGoogleAdapter)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get(PrismaService);
    mockGoogleAdapter = moduleFixture.get(GoogleAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    describe('positive', () => {
      it('should return share-summary', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(mockShareLink as any);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
            link: mockUUID,
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should return share-summary if diary-days are empty', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(mockShareLink as any);
        prisma.diaryDay.findMany.mockResolvedValue([]);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
            link: mockUUID,
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should cater for sharelink not found', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(null);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
            link: mockUUID,
          });

        expect(response.status).toEqual(500);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for missing query parameters', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(null);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({});

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for dateFrom after dateTo', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(null);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({
            dateFrom: '2023-05-23',
            dateTo: '2023-04-28',
            link: mockUUID,
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for dateFrom and dateTo not in correct date format', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(null);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({
            dateFrom: 'bad',
            dateTo: 'format',
            link: mockUUID,
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for max date-range', async () => {
        prisma.shareLink.findFirst.mockResolvedValue(null);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/share')
          .query({
            dateFrom: '2020-04-23',
            dateTo: '2023-04-28',
            link: mockUUID,
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/generate-link (PUT)', () => {
    describe('positive', () => {
      beforeEach(() => {
        prisma.shareLink.upsert.mockResolvedValue({} as any);
      });

      it('should generate a new share-link and return', async () => {
        prisma.shareLink.upsert.mockResolvedValue({} as any);
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/share/generate-link')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).put(
          '/share/generate-link',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for link update error', async () => {
        prisma.shareLink.upsert.mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'Error occurred',
            'P2002',
            'v1',
          ),
        );
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/share/generate-link')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(500);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/link-shareable (PUT)', () => {
    describe('positive', () => {
      beforeEach(() => {
        prisma.shareLink.update.mockResolvedValue({} as any);
      });

      it('should update link-shareanble state', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/share/link-shareable')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ isShared: true });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).put(
          '/share/link-shareable',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for isShared flag wrong format', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/share/link-shareable')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ isShared: 'test' });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for empty body', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/share/link-shareable')
          .set('Authorization', 'Bearer ' + access_token)
          .send({});

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
