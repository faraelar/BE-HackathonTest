import { ApiProperty } from '@nestjs/swagger';
import { IsString ,IsNumber } from 'class-validator';
import { File } from 'multer';
import { Transform } from 'class-transformer';
export class CreateQuizDto {
  @IsString()
  @ApiProperty({ example: '' })
  title: string;
  @ApiProperty({ example: '' })
  description: string;
  @IsNumber()
    @Transform(({ value }) => Number(value))
  @ApiProperty({ example: '' }) 
  time:  number;          

  @ApiProperty({
    description: 'Main image for the quiz.',
    type: 'string',
    format: 'binary',
  })
  mainImg: File;
}
