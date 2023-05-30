import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SummaryModule } from '@/summary/summary.module';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import { AppModule } from '@/app.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersService } from '@/users/users.service';
import { isValidPassword } from '@/lib/validation/validate-user';
import { GoogleAdapter } from '@/auth/adapter/google.adapter';

import { mockLoginResponseBody } from '../e2e.setup';
import { user_fixture, diaryDays_fixture } from '../__fixtures__';

jest.mock('@/lib/validation/validate-user');

const mockError = jest.fn();

describe('SummaryController (e2e)', () => {
  let app: INestApplication;
  let prisma: DeepMockProxy<PrismaClient>;
  let mockUsersService: jest.Mocked<Partial<UsersService>>;
  let mockGoogleAdapter: jest.Mocked<Partial<GoogleAdapter>>;

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
      imports: [AppModule, AuthModule, SummaryModule],
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
      it('should get a users summary between 2 dates', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for empty dairy-day data', async () => {
        prisma.diaryDay.findMany.mockResolvedValue([]);

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should throw error if no user is found', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(null);
        (isValidPassword as jest.Mock).mockResolvedValue(null);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
          });

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should throw error if google verification fails', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(false);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '2023-04-23',
            dateTo: '2023-04-28',
          });

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should throw error if from date is after before date', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '2023-04-28',
            dateTo: '2023-04-23',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should throw error if date range is greater than MAX_SUMMARY_MONTH_RANGE = 6', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '2020-04-28',
            dateTo: '2023-04-28',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should throw error if dateFrom and dateTo are empty', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: '',
            dateTo: '',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should throw error if dates are not in date format', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .get('/summary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({
            dateFrom: 'bad',
            dateTo: 'input',
            test: 'test',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
