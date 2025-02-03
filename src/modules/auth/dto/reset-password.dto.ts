import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    description:
      'Strong password is required, must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter and 1 symbol',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  newPassword: string;

  @IsEmail()
  @ApiProperty()
  userEmail: string;
}
