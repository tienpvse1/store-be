import { IsNotPublic, IsPublic } from '@decorators/is-public.decorator';
import { UserInfo } from '@decorators/user';
import { User } from '@modules/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ErrorResponse } from 'error/error-response';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpPasscodeDto } from './dto/send-reset-pass-code.dto';
import { SignupDto } from './dto/sign-up.dto';
import { AuthGuard } from './jwt.guard';

@Controller('auth')
@ApiTags('Auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'login success', type: AuthResponse })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized, bad credentials',
    type: ErrorResponse(401),
  })
  @ApiOperation({
    summary: 'Login',
    description: 'Login with email and password',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('sign-up')
  @ApiCreatedResponse({ description: 'sign up success', type: AuthResponse })
  @ApiOperation({
    summary: 'Sign up',
    description: 'Sign up with email and password',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ErrorResponse(400),
  })
  signUp(@Body() dto: SignupDto) {
    return this.authService.signUp(dto);
  }

  @Post('send-otp')
  @ApiCreatedResponse({
    description: 'otp passcode sent successfully',
    type: AuthResponse,
  })
  @ApiOperation({
    summary: 'Send OTP passcode to reset password',
    description:
      'Required user to input their email, then sent the otp passcode to their email account if exists',
  })
  @ApiNotFoundResponse({
    description: 'account with email not found',
    type: ErrorResponse(HttpStatus.BAD_REQUEST),
  })
  @Throttle({ default: { ttl: 300000, limit: 1 } })
  sendOtpCode(@Body() dto: SendOtpPasscodeDto) {
    return this.authService.sendResetPassCode(dto.email);
  }

  @Post('reset-password')
  @ApiCreatedResponse({
    description: 'Password reset successfully',
    type: AuthResponse,
  })
  @ApiOperation({
    summary: 'Reset password',
    description:
      'Required user to input their new password and sent OTP passcode',
  })
  @ApiNotFoundResponse({
    description: 'no active otp found',
    type: ErrorResponse(HttpStatus.UNAUTHORIZED),
  })
  @ApiInternalServerErrorResponse({
    description: 'cannot reset password for some reason',
    type: ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR),
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('verify')
  @IsNotPublic()
  @ApiOperation({
    summary: 'Verify user token ',
    description:
      'Verify user token, returns user information if token is valid',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'User information' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponse(HttpStatus.UNAUTHORIZED),
  })
  @ApiBearerAuth('Authorization')
  verify(@UserInfo() user: User) {
    console.log(user);
    return user;
  }
}
