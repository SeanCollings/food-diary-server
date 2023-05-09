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
import { DiaryModule } from '@/diary/diary.module';

import { mockLoginResponseBody } from '../e2e.setup';
import { diaryDays_fixture, user_fixture } from '../__fixtures__';
import { todayDate_fixture } from '../__fixtures__/today.date.fixture';

jest.mock('@/lib/validation/validate-user');

const mockError = jest.fn();

describe('DiaryController (e2e)', () => {
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
      imports: [AppModule, AuthModule, DiaryModule],
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
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;
    });

    describe('positive', () => {
      it('should get diary entries for entire month of date', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/diary')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).get('/diary');

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for missing date query', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/diary')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/calendar-entries (GET)', () => {
    let access_token: string;

    beforeEach(async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
      (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

      access_token = (await mockLoginResponseBody(request, app)).access_token;
    });

    describe('positive', () => {
      it('should get calendar-entries for date and number months back', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/diary/calendar-entries')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture, months: 3 });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should not allow non-logged in users', async () => {
        const response = await request(app.getHttpServer()).get(
          '/diary/calendar-entries',
        );

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for missing query', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/diary/calendar-entries')
          .set('Authorization', 'Bearer ' + access_token);

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should cater for month range greater than the max = 6', async () => {
        prisma.diaryDay.findMany.mockResolvedValue(diaryDays_fixture);

        const response = await request(app.getHttpServer())
          .get('/diary/calendar-entries')
          .set('Authorization', 'Bearer ' + access_token)
          .query({ date: todayDate_fixture, months: 12 });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
