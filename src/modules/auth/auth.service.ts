import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenSigner } from 'src/common/signer/signer';
import { PasswordHasher } from '../hasher/interface';
import { UserService } from '../user/user.service';
import { AuthResponse } from './dto/auth.response';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordHasher: PasswordHasher,
    private tokenSigner: TokenSigner,
    private config: ConfigService,
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
    const createdUser = await this.userService.createCustomer(dto);
    const accessToken = this.tokenSigner.signToken(createdUser, '3m');
    return {
      accessToken,
      refreshToken: '',
      user: createdUser,
    };
  }
}
