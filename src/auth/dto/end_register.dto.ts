import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IEndRegister {
  @IsString()
  @ApiProperty({ example: '' })
  code: string;
}
