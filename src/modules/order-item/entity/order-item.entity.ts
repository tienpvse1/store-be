import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty()
  id: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  orderId: string;
  @ApiProperty()
  quantity: number;
}
