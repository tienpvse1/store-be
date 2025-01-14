import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ description: 'must larger than 0' })
  @Min(0.1)
  @IsNotEmpty()
  price: number;
  @ApiProperty({ default: 0, required: false })
  @Min(0)
  quantity?: number;
}
