import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpPasscodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
