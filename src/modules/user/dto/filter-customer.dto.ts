import { ApiProperty } from '@nestjs/swagger';

export class FilterCustomerDto {
  @ApiProperty({
    type: 'string',
    description: 'Search customer base on their email, name',
  })
  search: string;

  @ApiProperty({
    type: 'boolean',
    description:
      'Filter customer base on their activation status, ignore this to get all customer',
    default: true,
  })
  isActive: boolean;
}
