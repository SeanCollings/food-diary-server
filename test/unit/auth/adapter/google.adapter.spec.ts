import { GoogleAdapter } from '@/auth/adapter/google.adapter';
import { GOOGLE_RECAPTCHA_PASS_SCORE } from '@/auth/auth.constants';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

describe('GoogleAdapter', () => {
  const mockGoogleToken = 'mock_google_token';
  const mockError = jest.fn();
  let adapter: GoogleAdapter;
  let mockHttpService: jest.Mocked<Partial<HttpService>>;
  let mockConfigService: jest.Mocked<Partial<ConfigService>>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(mockError);
  });

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn(),
    };
    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAdapter, HttpService, ConfigService],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    adapter = module.get<GoogleAdapter>(GoogleAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('verifySite', () => {
    const deafultResponse = {
      headers: {},
      config: { url: '/mockUrl' },
      status: 200,
      statusText: 'OK',
    };

    it('should pass if score greater than pass-score', async () => {
      const mockVerified: AxiosResponse<any> = {
        ...deafultResponse,
        data: { success: true, score: 0.9 },
      };
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        of(mockVerified),
      );

      const result = await adapter.verifySite(mockGoogleToken);
      expect(result).toBeTruthy();
    });

    it('should pass if score equal to pass-score', async () => {
      const mockVerified: AxiosResponse<any> = {
        ...deafultResponse,
        data: { success: true, score: GOOGLE_RECAPTCHA_PASS_SCORE },
      };
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        of(mockVerified),
      );

      const result = await adapter.verifySite(mockGoogleToken);
      expect(result).toBeTruthy();
    });

    it('should not pass if score less than pass-score', async () => {
      const mockUnVerified: AxiosResponse<any> = {
        ...deafultResponse,
        data: { success: true, score: 0.1 },
      };
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        of(mockUnVerified),
      );

      const result = await adapter.verifySite(mockGoogleToken);
      expect(result).toBeFalsy();
    });

    it('should handle error in post with error response data', async () => {
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        throwError(() => ({} as AxiosError)),
      );

      try {
        await adapter.verifySite(mockGoogleToken);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith('recaptcha error:', undefined);
        expect(err.message).toMatchInlineSnapshot(
          `"A verification error ocurred!"`,
        );
      }
    });

    it('should handle error in post without error response data', async () => {
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        throwError(
          () => ({ response: { data: { success: false } } } as AxiosError),
        ),
      );

      try {
        await adapter.verifySite(mockGoogleToken);
      } catch (err) {
        expect(mockError).toHaveBeenCalledWith('recaptcha error:', {
          success: false,
        });
        expect(err.message).toMatchInlineSnapshot(
          `"A verification error ocurred!"`,
        );
      }
    });

    it('should throw error if verification failed', async () => {
      const mockFail: AxiosResponse<any> = {
        ...deafultResponse,
        data: {
          success: false,
          action: 'mock_action',
          'error-codes': ['error_code_1', 'error_code_1'],
        },
      };
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        of(mockFail),
      );

      try {
        await adapter.verifySite(mockGoogleToken);
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(
          `"Verification failed for mock_action: error_code_1,error_code_1"`,
        );
      }
    });

    it('should throw error if verification failed without error codes', async () => {
      const mockFail: AxiosResponse<any> = {
        ...deafultResponse,
        data: {
          success: false,
          action: 'mock_action',
        },
      };
      (mockHttpService.post as jest.Mock).mockImplementation(() =>
        of(mockFail),
      );

      try {
        await adapter.verifySite(mockGoogleToken);
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(
          `"Verification failed for mock_action: "`,
        );
      }
    });
  });
});
