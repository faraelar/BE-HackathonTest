import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ILogin {
  @IsString()
  @ApiProperty({ example: '' })
  password: string;
  @ApiProperty({ example: '' })
  email: string;
}
