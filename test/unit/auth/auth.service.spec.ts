import { GoogleAdapter } from '@/auth/adapter/google.adapter';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { randomBytes, scrypt } from 'crypto';
import { CreateUserDTO, ResetPasswordDto } from '@/auth/dtos';

jest.mock('util', () => ({
  ...jest.requireActual('util'),
  promisify: (cb: any) => cb,
}));
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  scrypt: jest.fn(),
  randomBytes: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;
  let mockJwtSerive: jest.Mocked<Partial<JwtService>>;
  let mockGoogleAdapter: jest.Mocked<Partial<GoogleAdapter>>;
  let mockUsersService: jest.Mocked<Partial<UsersService>>;

  const mockStoredPassword = 'password_salt.stored_hash';

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1682632800000); // '2022-04-27'
  });

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
    };
    mockJwtSerive = {
      sign: jest.fn(),
    };
    mockGoogleAdapter = {
      verifySite: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        PrismaService,
        GoogleAdapter,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(JwtService)
      .useValue(mockJwtSerive)
      .overrideProvider(GoogleAdapter)
      .useValue(mockGoogleAdapter)
      .compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    (scrypt as jest.Mock).mockResolvedValue('stored_hash');

    it('should return user if valid', async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce({
        password: mockStoredPassword,
      });

      const result = await service.validateUser('test@email.com', 'password');

      expect(result).toMatchInlineSnapshot(`
        {
          "password": "password_salt.stored_hash",
        }
      `);
    });

    it('should return null if no user found', async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.validateUser('test@email.com', 'password');
      expect(result).toMatchInlineSnapshot(`null`);
    });

    it('should return null if passwords dont match', async () => {
      (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce({
        password: 'wrong.password',
      });
      const result = await service.validateUser('test@email.com', 'password');
      expect(result).toMatchInlineSnapshot(`null`);
    });
  });

  describe('signup', () => {
    const createUser: CreateUserDTO = {
      email: 'test@email.com',
      name: 'Test Name',
      password: 'mock.password',
      token: 'mock_google_token',
    };

    it('should create a new user and return user', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
      (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce(null);
      (randomBytes as jest.Mock).mockReturnValue('mock_salt');
      (scrypt as jest.Mock).mockResolvedValue('mock_hash');
      prisma.user.create.mockResolvedValue({
        id: '124',
        name: 'Test Name',
      } as any);

      const result = await service.signup(createUser);

      expect(prisma.user.create.mock.calls[0][0]).toMatchInlineSnapshot(`
        {
          "data": {
            "email": "test@email.com",
            "name": "Test Name",
            "password": "mock_salt.mock_hash",
          },
        }
      `);
      expect(result).toMatchInlineSnapshot(`
        {
          "id": "124",
          "name": "Test Name",
        }
      `);
    });

    it('should throw error if google adapter not verified', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(false);
      try {
        await service.signup(createUser);
      } catch (err) {
        expect(err.message).toEqual('Something went wrong!');
        expect(prisma.user.create).not.toBeCalled();
      }
    });

    it('should throw error if user already exists', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
      (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce({
        id: '1234',
      } as any);

      try {
        await service.signup(createUser);
      } catch (err) {
        expect(err.message).toEqual('Email in use!');
        expect(prisma.user.create).not.toBeCalled();
      }
    });
  });

  describe('login', () => {
    const loginUser = {
      email: 'test@email.com',
      id: 1234,
      token: 'mock_google_token',
    };

    it('should login a user, update last-login and return jwt token', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
      prisma.user.update.mockResolvedValue({} as any);
      (mockJwtSerive.sign as jest.Mock).mockReturnValue('mock_new_token');

      const result = await service.login(loginUser);

      expect(prisma.user.update.mock.calls[0][0]).toMatchInlineSnapshot(`
        {
          "data": {
            "lastLogin": 2023-04-27T22:00:00.000Z,
          },
          "where": {
            "id": 1234,
          },
        }
      `);
      expect(result).toMatchInlineSnapshot(`
        {
          "access_token": "mock_new_token",
        }
      `);
    });

    it('should throw error if not verified by google', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(false);

      try {
        await service.login(loginUser);
      } catch (err) {
        expect(err.message).toEqual('Something went wrong!');
        expect(prisma.user.update).not.toHaveBeenCalled();
      }
    });
  });

  describe('resetPassword', () => {
    const resetUser: ResetPasswordDto = {
      email: 'test@email.com',
      token: 'mock_google_token',
    };

    it('should reset a users password', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(true);
      const result = await service.resetPassword(resetUser);
      expect(result).toMatchInlineSnapshot(`
        {
          "message": "Reset link sent",
        }
      `);
    });

    it('should throw error if google captcha fails', async () => {
      (mockGoogleAdapter.verifySite as jest.Mock).mockResolvedValue(false);
      try {
        await service.resetPassword(resetUser);
      } catch (err) {
        expect(err.message).toEqual('Something went wrong!');
      }
    });
  });
});
