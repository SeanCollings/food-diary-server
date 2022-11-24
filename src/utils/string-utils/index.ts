import { v4 as uuidv4 } from 'uuid';

export const createGuid = () => {
  return uuidv4();
};

export const trim = (value: string) => {
  return value?.trim();
};
