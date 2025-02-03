import {
    CodeGeneratorModule
} from '@common/code-generator/code-generator.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ProductModule } from '@modules/product/product.module';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { PostgresOrderRepository } from './repository/postgres';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: PostgresOrderRepository,
    },
  ],
  imports: [
    NotificationModule,
    ProductModule,
    CodeGeneratorModule.forFeature(),
  ],
})
export class OrderModule {}
