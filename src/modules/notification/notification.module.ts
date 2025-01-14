import { Module } from '@nestjs/common';
import { UserNotificationModule } from '../user-notification/user-notification.module';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotifierComposer } from './notifier/composed';
import { EmailNotifier } from './notifier/email';
import { Sendable } from './notifier/interface';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: Sendable,
      inject: [UserNotificationRepository, ConfigService],
      useFactory(
        repository: UserNotificationRepository,
        config: ConfigService,
      ) {
        const emailSender = new EmailNotifier(repository, config);
        const sender = new NotifierComposer(emailSender);
        return sender;
      },
    },
  ],
  imports: [UserNotificationModule],
  exports: [NotificationService],
})
export class NotificationModule {}
