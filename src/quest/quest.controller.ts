import {
  Post,
  UseInterceptors,
  UploadedFiles,
  Controller,
  Req,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateQuestDto } from './dto/createQuest.dto';
import * as Multer from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
@ApiTags('quest')
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) { }

  @Post('createquest')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'mainImg', maxCount: 1 }], {
      storage: Multer.memoryStorage(),
    }),
  )
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateQuestDto,
    description:
      'The data for the new quiz, including a file upload for the main image.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create_quiz(
    @UploadedFiles() file: { mainImg?: Multer.File },
    @Body() data: CreateQuestDto,
    @Req() req: any,
  ) {
    const mainImg = file?.mainImg ? file : null;
    console.log(mainImg)
    return await this.questService.create_quest(file, data, req);
  }
}
