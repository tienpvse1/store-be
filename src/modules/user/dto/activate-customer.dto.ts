import { ApiProperty } from '@nestjs/swagger';

export class ActivateCustomerDto {
  @ApiProperty({ type: 'number', description: 'Customer id to activate' })
  id: number;
}

export class DeactivateCustomerDto extends ActivateCustomerDto {}
