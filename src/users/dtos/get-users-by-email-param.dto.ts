import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUsersByEmailParamDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    type: String,
    required: true,
  })
  @IsEmail()
  email: string;
}
