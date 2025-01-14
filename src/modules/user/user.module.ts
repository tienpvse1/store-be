import { Module } from '@nestjs/common';
import { HasherModule } from '../hasher/hasher.module';
import { NotificationModule } from '../notification/notification.module';
import { PostgresUserRepository } from './repository/postgres';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'kysely_postgres_user',
      useClass: PostgresUserRepository,
    },
  ],
  imports: [HasherModule, NotificationModule],
  exports: [UserService],
})
export class UserModule {}
