import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number | string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  createdById: number;
  @ApiProperty()
  updatedById: number;
  @ApiProperty()
  isActive: boolean;
}
