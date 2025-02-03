import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class FilterOrderDto {
  @ApiProperty({
    required: false,
    default: 10,
    description: 'items per page, min is 0 and max is 50',
  })
  @Optional()
  @IsNumber()
  @Max(50)
  @Min(0)
  @Type(() => Number)
  @ValidateIf((o) => Boolean(o.pageSize))
  readonly pageSize?: number;

  @ApiProperty({
    required: false,
    default: 0,
    description: 'current page',
  })
  @Optional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ValidateIf((o) => Boolean(o.page))
  readonly page?: number;

  @ApiProperty({
    required: false,
    description: 'Search by order code',
  })
  @Optional()
  readonly search?: string;
}

export class FilterOrderDtoForAdmin extends FilterOrderDto {
  @ApiProperty({
    required: false,
  })
  @Optional()
  @IsNumber()
  readonly customerId?: number;
}
