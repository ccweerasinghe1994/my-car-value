import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetUserByIdParamDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
    type: Number,
  })
  @IsNumberString()
  id: number;
}
