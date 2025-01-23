import { OrderStatus } from '@common/order-status';
import { PaymentMethod } from '@common/payment-method';
import { OrderItem } from '@modules/order-item/entity/order-item.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Order {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty()
  customerAddress: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUpdatedAt: Date;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: OrderStatus })
  orderStatus: OrderStatus;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  lastUpdatedById: number;

  @ApiProperty()
  paid: boolean;

  @ApiProperty()
  orderItems: OrderItem[];
}
