import { trim } from '@/utils/string-utils';
import {
  EMAIL_MIN_LENGTH,
  EMAIL_REGEX,
  INPUT_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/lib/constants/validation/validation.constants';

export const validateEmail = (email: string) => {
  const trimEmail = trim(email);

  if (!trimEmail?.length) {
    return false;
  } else if (!EMAIL_REGEX.test(trimEmail)) {
    return false;
  }

  return (
    trimEmail.length >= EMAIL_MIN_LENGTH && trimEmail.length <= INPUT_MAX_LENGTH
  );
};

export const validatePassword = (password: string) => {
  const trimPassword = trim(password);

  if (!trimPassword?.length) {
    return false;
  }

  return (
    trimPassword.length >= PASSWORD_MIN_LENGTH &&
    trimPassword.length <= INPUT_MAX_LENGTH
  );
};

export const validateLogin = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => validateEmail(email) && validatePassword(password);
