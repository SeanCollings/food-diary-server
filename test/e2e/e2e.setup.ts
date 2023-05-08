import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

export async function mockLoginResponseBody<T = any>(
  request: (app: any) => supertest.SuperTest<supertest.Test>,
  app: INestApplication,
) {
  const { body } = await request(app.getHttpServer()).post('/auth/login').send({
    email: 'test@email.com',
    password: 'password',
    token: 'mock_google_token',
  });

  return body as T;
}
