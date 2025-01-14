import { Module } from '@nestjs/common';
import { HasherModule } from '../hasher/hasher.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
  ],
  imports: [UserModule, HasherModule],
})
export class AuthModule {}
