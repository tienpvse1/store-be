import { Otp } from './entities/otp.entity';

export abstract class OtpRepository {
  abstract setOtpForUser(userId: number, passcode: string): Promise<Otp>;
  abstract deactivateOtherPasscode(userId: number): Promise<void>;

  abstract findActiveOtpByUserEmail(email: string): Promise<Otp>;
}
