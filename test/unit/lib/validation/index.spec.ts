import { INPUT_MAX_LENGTH } from '@/lib/constants/validation/validation.constants';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants/validation/validation.constants';
import {
  validateEmail,
  validatePassword,
  validateLogin,
} from '@/lib/validation';

describe('Validation', () => {
  describe('validateEmail', () => {
    it('should validate email', () => {
      const result = validateEmail('test@email.com');
      expect(result).toBeTruthy();
    });

    it('should handle empty input', () => {
      const result1 = validateEmail('');
      const result2 = validateEmail(null as any);
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });

    it.each(['test@email', '@email.com', 'test.email', 'test@.com', 'a@b.c'])(
      'should handle invalid format %s',
      (invalidEmail: string) => {
        expect(validateEmail(invalidEmail)).toBeFalsy();
      },
    );
  });

  describe('validatePassword', () => {
    it('should validate password', () => {
      const result = validatePassword('valid_password');
      expect(result).toBeTruthy();
    });

    it('should handle empty passwords', () => {
      const result1 = validatePassword('');
      const result2 = validatePassword(null as any);
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });

    it(`should handle password shorter than ${PASSWORD_MIN_LENGTH}`, () => {
      const password = '1234567';
      const result = validatePassword(password);
      expect(password.length).toBeLessThan(PASSWORD_MIN_LENGTH);
      expect(result).toBeFalsy();
    });

    it(`should handle password longer than long ${INPUT_MAX_LENGTH}`, () => {
      const password =
        '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901';
      const result = validatePassword(password);
      expect(password.length).toBeGreaterThan(INPUT_MAX_LENGTH);
      expect(result).toBeFalsy();
    });
  });

  describe('validateLogin', () => {
    it('should validate login', () => {
      const result = validateLogin({
        email: 'test@email.com',
        password: 'valid_password',
      });
      expect(result).toBeTruthy();
    });

    it('should handle invalid password', () => {
      const result = validateLogin({
        email: 'test@email.com',
        password: '',
      });
      expect(result).toBeFalsy();
    });

    it('should handle invalid email', () => {
      const result = validateLogin({
        email: 'test@email',
        password: 'valid_password',
      });
      expect(result).toBeFalsy();
    });
  });
});
