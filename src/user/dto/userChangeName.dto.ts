import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class UserChangeDto {
  
 @IsString()
  @ApiProperty({ example: '' })
  name:string
}