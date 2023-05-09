import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import { AppModule } from '@/app.module';
import { UsersService } from '@/users/users.service';
import { isValidPassword } from '@/lib/validation/validate-user';
import { GoogleAdapter } from '@/auth/adapter/google.adapter';

import { mockLoginResponseBody } from '../e2e.setup';
import { diaryDays_fixture, user_fixture } from '../__fixtures__';

jest.mock('@/lib/validation/validate-user');

const mockError = jest.fn();

describe('MealsController (e2e)', () => {
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
      imports: [AppModule],
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

  describe('/profile (GET)', () => {
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
      it('should get a users profile', async () => {
        prisma.user.findUnique.mockResolvedValue(user_fixture);
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/user/profile')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).get(
          '/user/profile',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/ (PATCH)', () => {
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
      it('should update a users profile', async () => {
        prisma.user.update.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .patch('/user')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ name: 'New Name' });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).patch('/user');

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should not allow empty name', async () => {
        prisma.user.update.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .patch('/user')
          .set('Authorization', 'Bearer ' + access_token)
          .send({});

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/preferences (PATCH)', () => {
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
      it('should update a users preferences', async () => {
        prisma.user.update.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .patch('/user/preferences')
          .set('Authorization', 'Bearer ' + access_token)
          .send({
            showWeeklyWater: false,
            showWeeklyExcercise: true,
            showDayStreak: false,
          });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should handle empty preferences body', async () => {
        prisma.user.update.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .patch('/user/preferences')
          .set('Authorization', 'Bearer ' + access_token)
          .send({});

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).patch(
          '/user/preferences',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for incorrect attributes', async () => {
        prisma.user.update.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .patch('/user/preferences')
          .set('Authorization', 'Bearer ' + access_token)
          .send({
            showWeeklyWater: 'bad_text',
            showWeeklyExcercise: 1234,
            showDayStreak: 'more text',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
