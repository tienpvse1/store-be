import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
const mockAuthService = {
  login: vi.fn(),
  signUp: vi.fn(),
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
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    vi.spyOn(mockAuthService, 'login');
    await controller.login({ email: 'random@example.com', password: 'password' });
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should call signUp', async () => {
    vi.spyOn(mockAuthService, 'signUp');
    await controller.signUp({name: 'random' ,email: 'random@example.com', password: 'password' });
    expect(mockAuthService.signUp).toHaveBeenCalled();
  });
});
