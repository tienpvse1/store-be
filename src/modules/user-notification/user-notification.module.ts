import { Module } from '@nestjs/common';
import { UserNotificationPostgresRepository } from './repositories/postgres';
import { UserNotificationRepository } from './user-notification.repository';
import { UserNotificationService } from './user-notification.service';

@Module({
  providers: [
    UserNotificationService,
    {
      provide: UserNotificationRepository,
      useClass: UserNotificationPostgresRepository,
    },
  ],
  exports: [
    {
      provide: UserNotificationRepository,
      useClass: UserNotificationPostgresRepository,
    },
  ],
})
export class UserNotificationModule {}
