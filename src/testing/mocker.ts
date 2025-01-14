import { TokenSigner } from 'src/common/signer/signer';
import { PasswordHasher } from 'src/modules/hasher/interface';
import { vi } from 'vitest';

export function getTestUser() {
  return {
    id: 1,
    email: 'random@example.com',
    password: 'password',
    isActive: true,
    roles: ['user'],
  };
}

export const mockConfigService = {
  get: vi.fn().mockReturnValue('value'),
};

export const mockHasherService: PasswordHasher = {
  hashPassword: vi.fn().mockReturnValue('hash'),
  comparePassword: vi.fn().mockReturnValue(true),
};

export const mockTokenSigner: TokenSigner = {
  signToken: vi.fn().mockReturnValue('token'),
  verifyToken: vi.fn().mockReturnValue(getTestUser()),
};
