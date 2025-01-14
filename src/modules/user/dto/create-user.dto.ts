import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'unique email' })
  @IsEmail()
  email: string;
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
  password: string;
}
