import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { GoogleAdapter } from '@/auth/adapter/google.adapter';
import { AuthModule } from '@/auth/auth.module';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { WellnessModule } from '@/wellness/wellness.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { isValidPassword } from '@/lib/validation/validate-user';
import { WellnessEntry } from '@/wellness/dtos/wellness-entry.dto';

import { mockLoginResponseBody } from '../e2e.setup';
import {
  user_fixture,
  wellnessMultiple_fixture,
  wellnessSingleEmpty_fixture,
  wellnessSingle_fixture,
} from '../__fixtures__';

jest.mock('@/lib/validation/validate-user');
jest.mock('@/lib/constants/validation/validation.constants', () => ({
  ...jest.requireActual('@/lib/constants/validation/validation.constants'),
  TEXTAREA_MAX_LENGTH: 15,
}));

const mockError = jest.fn();

describe('WellnessController (e2e)', () => {
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
      imports: [AppModule, AuthModule, WellnessModule],
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

  describe('/ (PUT)', () => {
    describe('positive', () => {
      it('should update single wellness entry', async () => {
        prisma.diaryDay.upsert.mockResolvedValue({ id: '1' } as any);
        prisma.user.findUnique.mockResolvedValue(user_fixture);
        prisma.user.update.mockResolvedValue(user_fixture);

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/wellness')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ data: wellnessSingle_fixture });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchInlineSnapshot(`{}`);
      });

      it('should update multiple wellness entries', async () => {
        prisma.diaryDay.upsert.mockResolvedValue({ id: '1' } as any);
        prisma.user.findUnique.mockResolvedValue(user_fixture);
        prisma.user.update.mockResolvedValue(user_fixture);

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/wellness')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ data: wellnessMultiple_fixture });

        expect(response.status).toEqual(200);
        expect(response.body).toMatchInlineSnapshot(`{}`);
      });
    });

    describe('negative', () => {
      it('should return errors for lack of input', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/wellness')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ data: [] });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchInlineSnapshot(`
          {
            "error": "Bad Request",
            "message": [
              "data should not be empty",
            ],
            "statusCode": 400,
          }
        `);
      });

      it('should return errors for bad beverage data', async () => {
        const badBeverageData: WellnessEntry[] = [
          {
            ...wellnessSingleEmpty_fixture[0],
            water: { value: 'test' } as any,
            alcohol: { value: '' } as any,
            tea_coffee: { value: 123 } as any,
          },
        ];

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/wellness')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ data: badBeverageData });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchInlineSnapshot(`
          {
            "error": "Bad Request",
            "message": [
              "data.0.water.value must not be greater than 99",
              "data.0.water.value must not be less than 0",
              "data.0.water.value must be a number conforming to the specified constraints",
              "data.0.tea_coffee.value must not be greater than 99",
              "data.0.alcohol.value must not be greater than 99",
              "data.0.alcohol.value must not be less than 0",
              "data.0.alcohol.value should not be empty",
              "data.0.alcohol.value must be a number conforming to the specified constraints",
            ],
            "statusCode": 400,
          }
        `);
      });

      it('should return errors for bad excercise data', async () => {
        const badExcerciseData: WellnessEntry[] = [
          {
            ...wellnessSingleEmpty_fixture[0],
            excercise: { time: 'hello there', details: '12345678901234567890' },
          },
        ];

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/wellness')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ data: badExcerciseData });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchInlineSnapshot(`
          {
            "error": "Bad Request",
            "message": [
              "data.0.excercise.time has invalid syntax",
              "data.0.excercise.time must be shorter than or equal to 5 characters",
              "data.0.excercise.details must be shorter than or equal to 15 characters",
            ],
            "statusCode": 400,
          }
        `);
      });

      it('should return errors for missing excercise time', async () => {
        const badExcerciseData: WellnessEntry[] = [
          {
            ...wellnessSingleEmpty_fixture[0],
            excercise: {} as any,
          },
        ];

        (mockUsersService.findOne as jest.Mock).mockResolvedValue(user_fixture);
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const { access_token } = await mockLoginResponseBody(request, app);

        const response = await request(app.getHttpServer())
          .put('/wellness')
          .set('Authorization', 'Bearer ' + access_token)
          .send({ data: badExcerciseData });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchInlineSnapshot(`
          {
            "error": "Bad Request",
            "message": [
              "data.0.excercise.time has invalid syntax",
              "data.0.excercise.time must be shorter than or equal to 5 characters",
              "data.0.excercise.time must be longer than or equal to 5 characters",
              "data.0.excercise.time must be a string",
              "data.0.excercise.time should not be empty",
            ],
            "statusCode": 400,
          }
        `);
      });
    });
  });
});
