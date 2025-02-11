import { TokenSigner } from '@common/signer/signer';
import { OtpService } from '@modules/otp/otp.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PasswordHasher } from '../hasher/interface';
import { UserService } from '../user/user.service';
import { AuthResponse } from './dto/auth.response';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly otpService: OtpService,
    private readonly userService: UserService,
    private readonly tokenSigner: TokenSigner,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const errorMessage = 'bad credentials!';
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException(errorMessage);
    const isPasswordValid = await this.passwordHasher.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException(errorMessage);
    delete user.password;
    const accessToken = this.tokenSigner.signToken(
      user,
      this.config.get('jwt.expiration'),
    );
    return { accessToken, user, refreshToken: '' };
  }

  async signUp(dto: SignupDto): Promise<AuthResponse> {
    try {
      const createdUser = await this.userService.createCustomer(dto);
      const accessToken = this.tokenSigner.signToken(createdUser, '3m');
      return {
        accessToken,
        refreshToken: '',
        user: createdUser,
      };
    } catch (error) {
      Logger.error(error);
    }
  }

  async sendResetPassCode(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new NotFoundException('user with email not found');
    await this.otpService.createOtp(user.id);
    return;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const isOtpValid = await this.otpService.validateOtp(
      dto.otp,
      dto.userEmail,
    );
    if (!isOtpValid) throw new UnauthorizedException('OTP is incorrect');
    const user = await this.userService.findUserByEmail(dto.userEmail);
    if (!user) throw new NotFoundException('user with email not found');
    try {
      const hashedNewPassword = await this.passwordHasher.hashPassword(
        dto.newPassword,
      );
      await this.userService.setPassword(user.id, hashedNewPassword);
    } catch (error) {
      Logger.error(error);

      throw new InternalServerErrorException('cannot update user password');
    }
    return this.login({ email: dto.userEmail, password: dto.newPassword });
  }
}
