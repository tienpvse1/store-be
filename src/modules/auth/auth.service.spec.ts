import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenSigner } from '@common/signer/signer';
import {
  mockConfigService,
  mockHasherService,
  mockTokenSigner,
} from '@testing/mocker';
import { vi } from 'vitest';
import { PasswordHasher } from '../hasher/interface';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/sign-up.dto';

const mockUserService = {
  findUserByEmail: vi.fn(),
  createCustomer: vi.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  const existingUser = {
    id: 1,
    email: 'random@example.com',
    password: 'password',
    isActive: true,
    roles: ['user'],
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token == UserService) return mockUserService;
        if (token == PasswordHasher) return mockHasherService;
        if (token == TokenSigner) return mockTokenSigner;
        if (token == ConfigService) return mockConfigService;
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return token', async () => {
      vi.spyOn(mockUserService, 'findUserByEmail').mockImplementation(() => {
        return existingUser;
      });
      const dto: LoginDto = {
        email: 'random@example.com',
        password: 'password',
      };
      const response = await service.login(dto);
      expect(mockHasherService.comparePassword).toHaveBeenCalledWith(
        dto.password,
        'password',
      );
      expect(mockTokenSigner.signToken).toHaveBeenCalled();

      expect(response.user['password']).not.toBeDefined();
      expect(response.accessToken).toBeDefined();
    });

    it("should throw UnauthorizedException if user doesn't exist", async () => {
      vi.spyOn(mockUserService, 'findUserByEmail').mockImplementation(() => {
        return undefined;
      });
      const dto: LoginDto = {
        email: 'random@example.com',
        password: 'password',
      };
      try {
        await service.login(dto);
      } catch (error) {
        expect(error.message).toBe('bad credentials!');
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it("should throws UnauthorizedException if password doesn't match", async () => {
      vi.spyOn(mockUserService, 'findUserByEmail').mockImplementation(() => {
        return existingUser;
      });
      vi.spyOn(mockHasherService, 'comparePassword').mockImplementation(() => {
        return Promise.resolve(false);
      });
      const dto: LoginDto = {
        email: 'random@example.com',
        password: 'password',
      };
      try {
        await service.login(dto);
      } catch (error) {
        expect(error.message).toBe('bad credentials!');
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
      expect(mockTokenSigner.signToken).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should return token', async () => {
      vi.spyOn(mockUserService, 'createCustomer').mockImplementation(() => {
        return existingUser;
      });
      const dto: SignupDto = {
        email: 'random@example.com',
        password: 'password',
        name: 'random',
      };

      const response = await service.signUp(dto);
      expect(mockTokenSigner.signToken).toHaveBeenCalled();
      expect(response.user['password']).not.toBeDefined();
    });
  });
});
