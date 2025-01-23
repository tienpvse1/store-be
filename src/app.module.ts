import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from '@common/db';
import env from '@common/env';
import { TokenSignerModule } from '@common/signer/signer.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthGuard } from '@modules/auth/jwt.guard';
import { HasherModule } from '@modules/hasher/hasher.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { UserNotificationModule } from '@modules/user-notification/user-notification.module';
import { UserModule } from '@modules/user/user.module';
import { RoleGuard } from '@modules/auth/role.guard';
import { ProductModule } from '@modules/product/product.module';
import { OrderModule } from '@modules/order/order.module';
import { OrderItemModule } from '@modules/order-item/order-item.module';
import { CodeGeneratorModule } from '@common/code-generator/code-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [env], isGlobal: true }),
    CodeGeneratorModule.forRoot(),
    DBModule.forRoot(),
    AuthModule,
    UserModule,
    HasherModule,
    TokenSignerModule.forRoot(),
    NotificationModule,
    UserNotificationModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
  controllers: [AppController],
})
export class AppModule {}
