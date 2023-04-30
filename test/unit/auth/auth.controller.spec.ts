import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { CreateUserDTO, LoginUserDTO, ResetPasswordDto } from '@/auth/dtos';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { RequestWithUser } from '@/auth/types';

describe('AuthController', () => {
  const mockError = jest.fn();
  let controller: AuthController;
  let authServiceMock: jest.Mocked<Partial<AuthService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
      resetPassword: jest.fn(),
      signup: jest.fn(),
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post /signup', () => {
    const createUser: CreateUserDTO = {
      email: 'test@email.com',
      name: 'Test Name',
      token: '1234',
      password: 'password',
    };

    it('should create a user', async () => {
      await controller.createUser(createUser);
      expect(authServiceMock.signup).toHaveBeenCalledWith(createUser);
    });

    it('should handle errors', async () => {
      authServiceMock.signup = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.createUser(createUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[auth::_post_signup]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      authServiceMock.signup = jest.fn().mockRejectedValue('No message');

      try {
        await controller.createUser(createUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[auth::_post_signup]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('post /login', () => {
    const mockUserRequest = {
      user: { id: 1234, email: 'test@email.com' },
    } as RequestWithUser;
    const loginUser: LoginUserDTO = {
      email: 'test@email.com',
      token: 'mock_token',
      password: 'password',
    };

    it('should login a user', async () => {
      await controller.login(mockUserRequest, loginUser);
      expect(authServiceMock.login).toHaveBeenCalledWith({
        id: 1234,
        email: 'test@email.com',
        token: 'mock_token',
      });
    });

    it('should handle errors', async () => {
      authServiceMock.login = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.login(mockUserRequest, loginUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[auth::_post_login]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      authServiceMock.login = jest.fn().mockRejectedValue('No message');

      try {
        await controller.login(mockUserRequest, loginUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[auth::_post_login]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('post /reset', () => {
    const resetUser: ResetPasswordDto = {
      email: 'test@email.com',
      token: 'mock_token',
    };

    it('should reset a password', async () => {
      await controller.resetPassword(resetUser);
      expect(authServiceMock.resetPassword).toHaveBeenCalledWith({
        email: 'test@email.com',
        token: 'mock_token',
      });
    });

    it('should handle errors', async () => {
      authServiceMock.resetPassword = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.resetPassword(resetUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[auth::_post_reset]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      authServiceMock.resetPassword = jest.fn().mockRejectedValue('No message');

      try {
        await controller.resetPassword(resetUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[auth::_post_reset]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
