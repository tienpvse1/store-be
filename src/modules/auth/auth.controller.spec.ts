import { Test, TestingModule } from '@nestjs/testing';
import { mockEmail } from '@testing/mocker';
import { vi } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
const mockAuthService = {
  login: vi.fn(),
  signUp: vi.fn(),
  sendResetPassCode: vi.fn(),
  resetPassword: vi.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token == AuthService) {
          return mockAuthService;
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    vi.spyOn(mockAuthService, 'login');
    await controller.login({
      email: 'random@example.com',
      password: 'password',
    });
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should call signUp', async () => {
    vi.spyOn(mockAuthService, 'signUp');
    await controller.signUp({
      name: 'random',
      email: 'random@example.com',
      password: 'password',
    });
    expect(mockAuthService.signUp).toHaveBeenCalled();
  });

  it('should call sendResetPassCode', async () => {
    vi.spyOn(mockAuthService, 'signUp');
    await controller.sendOtpCode({ email: mockEmail });
    expect(mockAuthService.sendResetPassCode).toHaveBeenCalled();
  });

  it('should call resetPassword', async () => {
    vi.spyOn(mockAuthService, 'signUp');
    await controller.resetPassword({
      otp: '000000',
      newPassword: 'Username730`',
      userEmail: mockEmail,
    });
    expect(mockAuthService.resetPassword).toHaveBeenCalled();
  });
});
