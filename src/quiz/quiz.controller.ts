import {
  Controller,
  Res,
  Body,
  Post,
  Get,
  Query,
  Delete,
  UseInterceptors,
  Req,
  ValidationPipe,
  UploadedFile,
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { ChangeQuizDto } from './dto/changeQuiz.dto';
import { DeleteQuizRemoveDto } from './dto/deleteQuiz.dto';
import * as Multer from 'multer';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @Get('get')
  @ApiOperation({ summary: 'Get products with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit per page',
    type: Number,
  })
  async getProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.quizService.get(pageNumber, limitNumber);
  }
  @Get('getone')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: String,
  })
  get_one(@Query('id') id: string) {
    return this.quizService.get_one(id);
  }

  @Post('createquiz')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'mainImg', maxCount: 1 }], {
      storage: Multer.memoryStorage(),
    }),
  )
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateQuizDto,
    description:
      'The data for the new quiz, including a file upload for the main image.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create_quiz(
    @UploadedFiles() file: { mainImg?: Multer.File },
    @Body() data: CreateQuizDto,
    @Req() req: any,
  ) {
    const mainImg = file?.mainImg ? file : null;
    return await this.quizService.create_quiz(file, data, req);
  }

  @Post('changequiz')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'mainImg', maxCount: 1 }], {
      storage: Multer.memoryStorage(),
    }),
  )
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ChangeQuizDto,
    description:
      'The data for the new quiz, including a file upload for the main image.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))

  async change_quiz(
    @UploadedFiles() file: { mainImg?: Multer.File },
    @Body() data: ChangeQuizDto,
    @Req() req: any,
  ) {
    const mainImg = file?.mainImg ? file : null;
    return await this.quizService.change_quiz(file, data, req);
  }

  @Delete('removequize')
  @ApiBody({
    type: DeleteQuizRemoveDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove_quiz(@Query('id') id: string, @Req() req: any) {
    return await this.quizService.remove_quiz(id, req);
  }
}
