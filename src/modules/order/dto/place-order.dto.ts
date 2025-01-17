import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PlaceOrderItem {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly productId: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly customerName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly customerEmail: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly customerPhone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly customerAddress: string;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly items: PlaceOrderItem[];
}
