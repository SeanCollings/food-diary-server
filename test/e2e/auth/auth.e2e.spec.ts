import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import { AppModule } from '@/app.module';
import { isValidPassword } from '@/lib/validation/validate-user';
import { GoogleAdapter } from '@/auth/adapter/google.adapter';
import { JwtService } from '@nestjs/jwt';

import { user_fixture } from '../__fixtures__';

jest.mock('@/lib/validation/validate-user');

const mockError = jest.fn();

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: DeepMockProxy<PrismaClient>;
  let mockGoogleAdapter: jest.Mocked<Partial<GoogleAdapter>>;
  let mockJwtSerive: jest.Mocked<Partial<JwtService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    mockGoogleAdapter = {
      verifySite: jest.fn(),
    };
    mockJwtSerive = {
      sign: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(GoogleAdapter)
      .useValue(mockGoogleAdapter)
      .overrideProvider(JwtService)
      .useValue(mockJwtSerive)
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

  describe('/signup (POST)', () => {
    describe('positive', () => {
      it('should signup a new user', async () => {
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.user.create.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            name: 'New User',
            email: 'test@email.com',
            password: 'password',
            token: 'mock_token',
          });

        expect(response.status).toEqual(201);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should fail if no body sent', async () => {
        const response = await request(app.getHttpServer()).post(
          '/auth/signup',
        );

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });

      it('should fail if user name is missing', async () => {
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
        prisma.user.findUnique.mockResolvedValue(user_fixture);
        prisma.user.create.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            name: null,
            email: 'test@email.com',
            password: 'password',
            token: 'mock_token',
          });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/login (POST)', () => {
    describe('positive', () => {
      it('should login a user', async () => {
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
        (mockJwtSerive.sign as jest.Mock).mockReturnValue('mock_new_token');
        prisma.user.update.mockResolvedValue(user_fixture);
        prisma.user.create.mockResolvedValue(user_fixture);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@email.com',
            password: 'password',
            token: 'mock_token',
          });

        expect(response.status).toEqual(201);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should fail if no body sent', async () => {
        const response = await request(app.getHttpServer()).post('/auth/login');

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should fail if password not valid', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@email.com',
            password: '',
            token: 'mock_token',
          });

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should fail if email not valid', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: '@email.com',
            password: 'password',
            token: 'mock_token',
          });

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });

      it('should fail if google captcha fails', async () => {
        (isValidPassword as jest.Mock).mockResolvedValue(user_fixture);
        prisma.user.findUnique.mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(false);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@email.com',
            password: 'password',
            token: 'mock_token',
          });

        expect(response.status).toEqual(500);
        expect(response.body).toMatchSnapshot();
      });

      it('should fail if cant validate user', async () => {
        (isValidPassword as jest.Mock).mockResolvedValue(null);
        prisma.user.findUnique.mockResolvedValue(user_fixture);
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@email.com',
            password: 'password',
            token: 'mock_token',
          });

        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe('/reset (POST)', () => {
    describe('positive', () => {
      it('should reset a user password', async () => {
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);

        const response = await request(app.getHttpServer())
          .post('/auth/reset')
          .send({
            email: 'test@email.com',
            token: 'mock_token',
          });

        expect(response.status).toEqual(201);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('negative', () => {
      it('should fail if google captcha fails', async () => {
        (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(false);

        const response = await request(app.getHttpServer())
          .post('/auth/reset')
          .send({
            email: 'test@email.com',
            token: 'mock_token',
          });

        expect(response.status).toEqual(500);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
