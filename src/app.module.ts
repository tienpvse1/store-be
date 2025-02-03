import { DBModule } from '@common/db';
import env from '@common/env';
import { TokenSignerModule } from '@common/signer/signer.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthGuard } from '@modules/auth/jwt.guard';
import { RoleGuard } from '@modules/auth/role.guard';
import { HasherModule } from '@modules/hasher/hasher.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { OrderItemModule } from '@modules/order-item/order-item.module';
import { OrderModule } from '@modules/order/order.module';
import { ProductModule } from '@modules/product/product.module';
import { UserNotificationModule } from '@modules/user-notification/user-notification.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { OtpModule } from './modules/otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [env], isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    TokenSignerModule.forRoot(),
    DBModule.forRoot(),
    AuthModule,
    UserModule,
    HasherModule,
    NotificationModule,
    UserNotificationModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
    OtpModule,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  controllers: [AppController],
})
export class AppModule {}
