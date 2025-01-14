import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/error/error-response';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/sign-up.dto';
import { IsPublic } from 'src/custom-decorators/is-public.decorator';

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
}
