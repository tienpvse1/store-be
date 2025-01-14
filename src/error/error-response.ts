import { ApiProperty } from '@nestjs/swagger';

export function ErrorResponse(code: number) {
  class ErrorResponse {
    @ApiProperty()
    message: string;

    @ApiProperty()
    error: string;

    @ApiProperty({ type: 'number', default: code })
    code: number;
  }
  return ErrorResponse;
}
