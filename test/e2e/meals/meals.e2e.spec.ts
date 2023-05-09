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
import { UsersModule } from '@/users/users.module';
import { MealTypesEnum } from '@/meals/types';

import { mockLoginResponseBody } from '../e2e.setup';
import {
  diaryDaySingle_fixture,
  mealContentDto_fixture,
  user_fixture,
} from '../__fixtures__';
import { todayDate_fixture } from '../__fixtures__/today.date.fixture';

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
      imports: [AppModule, AuthModule, UsersModule],
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

  describe('/ (POST)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;

      prisma.user.findUnique.mockResolvedValue(user_fixture);
      prisma.user.update.mockResolvedValue(user_fixture);
    });

    describe('positive', () => {
      it('should create a new meal entry', async () => {
        prisma.diaryDay.findUnique.mockResolvedValue(diaryDaySingle_fixture);
        prisma.diaryDay.upsert.mockResolvedValue({} as any);

        const response = await request(app.getHttpServer())
          .post('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture })
          .send({
            mealId: MealTypesEnum.BREAKFAST,
            content: mealContentDto_fixture,
          });

        expect(response.status).toEqual(201);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).post('/meals');

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of date query', async () => {
        const response = await request(app.getHttpServer())
          .post('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .send({
            mealId: MealTypesEnum.BREAKFAST,
            content: mealContentDto_fixture,
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of body', async () => {
        const response = await request(app.getHttpServer())
          .post('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for bad content format', async () => {
        const response = await request(app.getHttpServer())
          .post('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture })
          .send({
            mealId: MealTypesEnum.BREAKFAST,
            content: {},
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/ (PUT)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;

      prisma.user.findUnique.mockResolvedValue(user_fixture);
      prisma.user.update.mockResolvedValue(user_fixture);
    });

    describe('positive', () => {
      it('should update a meal entry', async () => {
        prisma.diaryDay.findUnique.mockResolvedValue(diaryDaySingle_fixture);
        prisma.diaryDay.update.mockResolvedValue({} as any);

        const response = await request(app.getHttpServer())
          .put('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture })
          .send({
            oldMealId: MealTypesEnum.BREAKFAST,
            newMealId: MealTypesEnum.LUNCH,
            content: mealContentDto_fixture,
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).put('/meals');

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of date query', async () => {
        const response = await request(app.getHttpServer())
          .put('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .send({
            oldMealId: MealTypesEnum.BREAKFAST,
            newMealId: MealTypesEnum.LUNCH,
            content: mealContentDto_fixture,
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of body', async () => {
        const response = await request(app.getHttpServer())
          .put('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for bad content format', async () => {
        const response = await request(app.getHttpServer())
          .put('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture })
          .send({
            oldMealId: MealTypesEnum.BREAKFAST,
            newMealId: MealTypesEnum.LUNCH,
            content: {},
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/ (DELETE)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;

      prisma.user.findUnique.mockResolvedValue(user_fixture);
      prisma.user.update.mockResolvedValue(user_fixture);
    });

    describe('positive', () => {
      it('should delete a meal entry', async () => {
        prisma.diaryDay.findUnique.mockResolvedValue(diaryDaySingle_fixture);
        prisma.diaryDay.update.mockResolvedValue({} as any);

        const response = await request(app.getHttpServer())
          .delete('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture })
          .send({
            mealId: MealTypesEnum.BREAKFAST,
            id: '1234567890123',
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).delete('/meals');

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of date query', async () => {
        const response = await request(app.getHttpServer())
          .delete('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .send({
            mealId: MealTypesEnum.BREAKFAST,
            id: '1234567890123',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for lack of body', async () => {
        const response = await request(app.getHttpServer())
          .delete('/meals')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
