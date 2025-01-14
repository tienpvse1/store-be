import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [String] })
  roles: string[];
}
