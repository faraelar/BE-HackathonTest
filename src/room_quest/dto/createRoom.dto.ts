import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';
export class CreateRoomDto {
  @IsString()
  @ApiProperty({ example: '' })
  id_quiz: string;
}

