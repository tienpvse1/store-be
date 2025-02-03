import { PaymentMethod } from '@common/payment-method';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class PlaceOrderItem {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly productId: number;
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
  @ApiProperty({ type: [PlaceOrderItem] })
  @Type(() => PlaceOrderItem)
  readonly items: PlaceOrderItem[];

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({
    required: false,
    enum: PaymentMethod,
    default: PaymentMethod.COD,
  })
  readonly paymentMethod?: PaymentMethod;
}
