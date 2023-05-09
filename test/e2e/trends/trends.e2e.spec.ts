import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import { AppModule } from '@/app.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersService } from '@/users/users.service';
import { isValidPassword } from '@/lib/validation/validate-user';
import { GoogleAdapter } from '@/auth/adapter/google.adapter';
import { TrendsModule } from '@/trends/trends.module';

import { mockLoginResponseBody } from '../e2e.setup';
import {
  diaryDaysMonth_fixture,
  diaryDays_fixture,
  user_fixture,
} from '../__fixtures__';

jest.mock('@/lib/validation/validate-user');

const mockError = jest.fn();

describe('TrendsController (e2e)', () => {
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
      imports: [AppModule, AuthModule, TrendsModule],
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

  describe('/meal-trends (GET)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;
    });

    describe('positive', () => {
      it('should get meal trends for week', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/trends/meal-trends')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ type: 'week' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should get meal trends for month', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDaysMonth_fixture);

        const response = await request(app.getHttpServer())
          .get('/trends/meal-trends')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ type: 'month' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).get(
          '/trends/meal-trends',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of query', async () => {
        const response = await request(app.getHttpServer())
          .get('/trends/meal-trends')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/beverage-trends (GET)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;

      prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);
    });

    describe('positive', () => {
      it('should get beverage trends for week', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/trends/beverage-trends')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ type: 'week' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should get beverage trends for month', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDaysMonth_fixture);

        const response = await request(app.getHttpServer())
          .get('/trends/beverage-trends')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ type: 'month' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).get(
          '/trends/beverage-trends',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of query', async () => {
        const response = await request(app.getHttpServer())
          .get('/trends/beverage-trends')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/excercise-trends (GET)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;

      prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);
    });

    describe('positive', () => {
      it('should get excercise trends for week', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/trends/excercise-trends')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ type: 'week' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should get excercise trends for month', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDaysMonth_fixture);

        const response = await request(app.getHttpServer())
          .get('/trends/excercise-trends')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ type: 'month' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).get(
          '/trends/excercise-trends',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of query', async () => {
        const response = await request(app.getHttpServer())
          .get('/trends/excercise-trends')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
