import { ApiProperty } from '@nestjs/swagger';
import { User } from '@modules/user/entities/user.entity';

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: User })
  user: User;
}
