import { Generator } from '@common/code-generator/generator';
import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class PassCodeGenerator extends Generator {
  private DIGITS = '0123456789';
  private OTP_LENGTH = 6;

  generateCode(): string {
    let otp = '';
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      const randomIndex = randomInt(0, this.DIGITS.length);
      otp += this.DIGITS[randomIndex];
    }
    return otp;
  }
}
