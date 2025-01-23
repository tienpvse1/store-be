import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PostgresOrderRepository } from './repository/postgres';
import { NotificationModule } from '@modules/notification/notification.module';
import { ProductModule } from '@modules/product/product.module';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: PostgresOrderRepository,
    },
  ],
  imports: [NotificationModule, ProductModule],
})
export class OrderModule {}
