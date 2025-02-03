import { Injectable, NotFoundException } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { NotificationService } from '@modules/notification/notification.service';
import { Generator } from '@common/code-generator';
import { NotificationEvent } from '@modules/notification/event';

@Injectable()
export class OtpService {
  constructor(
    private readonly repository: OtpRepository,
    private readonly codeGenerator: Generator,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Deactivate older pass code then create a new code for user
   */
  async createOtp(userId: number) {
    await this.repository.deactivateOtherPasscode(userId);
    const newPasscode = this.codeGenerator.generateCode();
    await this.repository.setOtpForUser(userId, newPasscode);
    this.notificationService.send(
      NotificationEvent.PasscodeGenerated,
      userId,
      `Your OTP: ${newPasscode} to reset password, please don't share with anyone`,
    );
  }

  async validateOtp(otp: string, userEmail: string) {
    const userOtp = await this.repository.findActiveOtpByUserEmail(userEmail);
    if (!userOtp)
      throw new NotFoundException('User does not have any active OTP');
    return userOtp.id === otp;
  }
}
