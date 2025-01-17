import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from '@modules/user/entities/user.entity';
import { mockConfigService } from '@testing/mocker';
import { vi } from 'vitest';
import { Role } from '../roles';
import { Hs256TokenSigner } from './hs256.singer';

vi.mock('jsonwebtoken', () => ({
  verify: vi.fn().mockReturnValue({
    id: 1,
    name: 'example',
    email: 'random@example.com',
    roles: [Role.User],
    isActive: true,
  }),
  sign: vi.fn().mockReturnValue('token'),
}));

describe('Hs256TokenSigner', () => {
  const verifiedUser: User = {
    id: 1,
    name: 'example',
    email: 'random@example.com',
    roles: [Role.User],
    isActive: true,
  };
  let service: Hs256TokenSigner;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [Hs256TokenSigner],
    })
      .useMocker((token) => {
        if (token == ConfigService) return mockConfigService;
      })
      .compile();
    service = module.get(Hs256TokenSigner);
  });

  describe('it should be defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should return user object', () => {
      const user = service.verifyToken('token');
      expect(user).toMatchObject(verifiedUser);
    });
  });

  describe('signToken', () => {
    it('should return token', () => {
      const token = service.signToken(verifiedUser, '1h');
      expect(token).toBe('token');
    });
  });
});
