import { ApiProperty } from '@nestjs/swagger';

export class FilterProductDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ type: 'array', required: false, items: { type: 'number' } })
  priceRange?: [number, number];

  @ApiProperty({ required: false })
  categoryIds?: number[];
}
