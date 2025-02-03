import { Module } from '@nestjs/common';
import { HasherModule } from '../hasher/hasher.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './jwt.guard';
import {
  CodeGenerateStrategy,
  CodeGeneratorModule,
} from '@common/code-generator/code-generator.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { OtpModule } from '@modules/otp/otp.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [
    UserModule,
    OtpModule,
    HasherModule,
    NotificationModule,
    CodeGeneratorModule.forFeature(CodeGenerateStrategy.PassCode),
  ],
})
export class AuthModule {}
