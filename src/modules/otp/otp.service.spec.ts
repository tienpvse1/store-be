import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { NotificationService } from '@modules/notification/notification.service';
import {
  mockEmail,
  mockGenerator,
  mockNotificationService,
} from '@testing/mocker';
import { OtpRepository } from './otp.repository';
import { Generator } from '@common/code-generator';
import { vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

const mockOtpRepository = {
  deactivateOtherPasscode: vi.fn(),
  setOtpForUser: vi.fn(),
  findActiveOtpByUserEmail: vi.fn(),
};

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpService],
    })
      .useMocker((token) => {
        if (token == NotificationService) return mockNotificationService;
        if (token == OtpRepository) return mockOtpRepository;
        if (token == Generator) return mockGenerator;
      })
      .compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOtp', () => {
    it('should send notification when called', async () => {
      vi.spyOn(mockNotificationService, 'send');
      await service.createOtp(0);
      expect(mockNotificationService.send).toHaveBeenCalled();
    });
  });

  describe('validateOtp', () => {
    it('should throws NotFoundException if user with email not found', async () => {
      vi.spyOn(mockOtpRepository, 'findActiveOtpByUserEmail').mockResolvedValue(
        undefined,
      );
      await expect(service.validateOtp('000000', mockEmail)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return falsy value if otp is incorrect', async () => {
      const correctOtp = '000000';
      const incorrectOtp = '000001';
      vi.spyOn(mockOtpRepository, 'findActiveOtpByUserEmail').mockResolvedValue(
        { id: correctOtp },
      );

      const result = await service.validateOtp(incorrectOtp, mockEmail);
      expect(result).toBeFalsy();
    });

    it('should return correct validate result', async () => {
      const correctOtp = '000000';
      vi.spyOn(mockOtpRepository, 'findActiveOtpByUserEmail').mockResolvedValue(
        { id: correctOtp },
      );

      const result = await service.validateOtp(correctOtp, mockEmail);
      expect(result).toBeTruthy();
    });
  });
});
