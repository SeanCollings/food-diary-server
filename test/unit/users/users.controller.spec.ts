import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { UpdatePreferencesDTO, UpdateUserDTO } from '@/users/dtos';
import { RequestWithUser } from '@/users/types';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersController', () => {
  const mockError = jest.fn();
  const mockUser = {
    user: { userId: 'mock_user_id', email: 'test@email.com' },
  } as RequestWithUser;

  let controller: UsersController;
  let usersServiceMock: jest.Mocked<Partial<UsersService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    usersServiceMock = {
      getUserProfile: jest.fn(),
      updateUser: jest.fn(),
      updateUserPreferences: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get /profile', () => {
    it('should get users profile', async () => {
      await controller.getUserProfile(mockUser);
      expect(usersServiceMock.getUserProfile).toBeCalledWith('mock_user_id');
    });

    it('should handle errors', async () => {
      usersServiceMock.getUserProfile = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.getUserProfile(mockUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[user::_get_profile]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      usersServiceMock.getUserProfile = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.getUserProfile(mockUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[user::_get_profile]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('patch /', () => {
    const mockUpdateUser: UpdateUserDTO = { name: 'Test Name' };

    it('should update users details', async () => {
      await controller.updateUser(mockUser, mockUpdateUser);
      expect(usersServiceMock.updateUser).toBeCalledWith(
        'mock_user_id',
        mockUpdateUser,
      );
    });

    it('should handle errors', async () => {
      usersServiceMock.updateUser = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.updateUser(mockUser, mockUpdateUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[user::_patch_]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      usersServiceMock.updateUser = jest.fn().mockRejectedValue('No message');

      try {
        await controller.updateUser(mockUser, mockUpdateUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[user::_patch_]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });

  describe('patch /preferences', () => {
    const mockUpdateUser: UpdatePreferencesDTO = {
      showDayStreak: true,
      showWeeklyExcercise: true,
      showWeeklyWater: false,
    };

    it('should update users preferences', async () => {
      await controller.updateUserPreferences(mockUser, mockUpdateUser);
      expect(usersServiceMock.updateUserPreferences).toBeCalledWith(
        'mock_user_id',
        mockUpdateUser,
      );
    });

    it('should handle errors', async () => {
      usersServiceMock.updateUserPreferences = jest
        .fn()
        .mockRejectedValue({ message: 'Error occurred' });

      try {
        await controller.updateUserPreferences(mockUser, mockUpdateUser);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(mockError).toHaveBeenCalledWith(
          '[user::_patch_preferences]:',
          'Error occurred',
        );
      }
    });

    it('should throw default error message', async () => {
      usersServiceMock.updateUserPreferences = jest
        .fn()
        .mockRejectedValue('No message');

      try {
        await controller.updateUserPreferences(mockUser, mockUpdateUser);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith(
          '[user::_patch_preferences]:',
          DEFAULT_ERROR_MSG,
        );
      }
    });
  });
});
