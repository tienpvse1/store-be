import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { NotificationModule } from '@modules/notification/notification.module';
import { OtpRepository } from './otp.repository';
import { PostgresOtpRepository } from './repository/postgres';
import {
  CodeGenerateStrategy,
  CodeGeneratorModule,
} from '@common/code-generator/code-generator.module';

@Module({
  providers: [
    OtpService,
    { provide: OtpRepository, useClass: PostgresOtpRepository },
  ],
  exports: [OtpService],
  imports: [
    NotificationModule,
    CodeGeneratorModule.forFeature(CodeGenerateStrategy.PassCode),
  ],
})
export class OtpModule {}
