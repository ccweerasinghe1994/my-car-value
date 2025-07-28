import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
    uniqueItems: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (must be strong)',
    example: 'MySecurePassword123!',
    minLength: 8,
    type: 'string',
    format: 'password',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
