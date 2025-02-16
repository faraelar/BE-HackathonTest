import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { File } from 'multer';
import { AnswerDto } from './answerQuest.dto';
export class CreateQuestDto {
  @IsString()
  @ApiProperty({ example: '' })
  id: string;
  @IsString()
  @ApiProperty({ example: '' })
  type: string;
  @IsString()
  @ApiProperty({ example: '' })
  title: string;
  @ApiProperty({ example: '' })
  description: string;
  @IsOptional()
  @ApiProperty({
    description: 'Main image for the quiz.',
    type: 'string',
    format: 'binary',
  })
  mainImg?: File;


  @ArrayMinSize(2)
  @ApiProperty({
    type: [AnswerDto],
    description: 'array question',
  })
  answer: AnswerDto[];
}
