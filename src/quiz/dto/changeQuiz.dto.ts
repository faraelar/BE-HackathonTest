import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { File } from 'multer';
export class ChangeQuizDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '' })
  id: string
  @ApiProperty({ example: '' })
  title: string;
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: '' })
  time: number;
  @ApiProperty({ example: '' })
  description: string;
  @ApiProperty({
    description: 'Main image for the quiz.',
    type: 'string',
    format: 'binary',
  })
  mainImg: File;
}
