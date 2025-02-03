import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty()
  id: string;
  @ApiProperty()
  productId: number;
  @ApiProperty()
  orderId: string;
  @ApiProperty()
  quantity: number;
}
