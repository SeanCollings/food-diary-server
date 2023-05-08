import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { User } from '@prisma/client';
import { SCRYPT_KEYLEN } from '@/auth/auth.constants';

const scrypt = promisify(_scrypt);

export const isValidPassword = async (user: User | null, password: string) => {
  if (!user) {
    return null;
  }

  const [salt, storedHash] = user.password.split('.');
  const hash = (await scrypt(password, salt, SCRYPT_KEYLEN)) as Buffer;

  if (storedHash === hash.toString('hex')) {
    return user;
  }

  return null;
};
