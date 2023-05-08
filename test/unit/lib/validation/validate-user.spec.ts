import { isValidPassword } from '@/lib/validation/validate-user';
import { User } from '@prisma/client';
import { scrypt } from 'crypto';

jest.mock('util', () => ({
  ...jest.requireActual('util'),
  promisify: (cb: any) => cb,
}));
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  scrypt: jest.fn(),
}));

describe('Validation', () => {
  const mockUser: Partial<User> = {
    id: 1234,
    password: 'password_salt.mock_hash',
  };
  const mockPassword = 'mock_salt.mock_hash';

  describe('validate-user', () => {
    it('should return valid user', async () => {
      (scrypt as jest.Mock).mockResolvedValue('mock_hash');

      const result = await isValidPassword(mockUser as any, mockPassword);
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user input', async () => {
      (scrypt as jest.Mock).mockResolvedValue('mock_hash');

      const result = await isValidPassword(null as any, mockPassword);
      expect(result).toBeNull();
    });

    it('should return null password not valid', async () => {
      (scrypt as jest.Mock).mockResolvedValue('mock_other_value');

      const result = await isValidPassword(mockUser as any, mockPassword);
      expect(result).toBeNull();
    });
  });
});
