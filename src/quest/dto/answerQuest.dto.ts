import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class AnswerDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  @Transform(({ value }) => (typeof value === 'boolean' ? value : JSON.parse(value)))


  isCorrect: boolean;

  @IsString()
  @ApiProperty({ example: '' })
  text: string;
}
