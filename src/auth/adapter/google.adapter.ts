import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { RecaptchaResponse } from '../types';
import { GOOGLE_RECAPTCHA_PASS_SCORE } from '../auth.constants';

@Injectable()
export class GoogleAdapter {
  private recaptchaVerifyUrl: string;
  private recaptchaSecretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.recaptchaVerifyUrl =
      this.configService.get('RECAPTCHA_VERIFY_URL') || '';
    this.recaptchaSecretKey =
      this.configService.get('RECAPTCHA_SECRET_KEY') || '';
  }

  async verifySite(token: string) {
    const params = {
      secret: this.recaptchaSecretKey,
      response: token,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post<RecaptchaResponse>(this.recaptchaVerifyUrl, null, { params })
        .pipe(
          catchError((error: AxiosError) => {
            console.error('recaptcha error:', error.response?.data);
            throw new Error('A verification error ocurred!');
          }),
        ),
    );

    if (!data.success) {
      throw new Error(
        `Verification failed for ${data.action}: ${(
          data['error-codes'] ?? []
        ).join()}`,
      );
    }

    return data.score >= GOOGLE_RECAPTCHA_PASS_SCORE;
  }
}
