import { Body, Controller, Post, Req } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }


  @Post("createquest")
  async create_quest(@Body() data, @Req() req: any) {
    return this.answerService.create_answer()

  }
}
