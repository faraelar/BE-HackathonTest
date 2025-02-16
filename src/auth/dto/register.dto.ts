import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IRegistretion {
  @ApiProperty({ example: 'JohnDoe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;
}
