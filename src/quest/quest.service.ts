import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as Multer from 'multer';
import { create_photo } from 'src/utils/create_photo';
@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) { }
  async create_quest(file: Multer.File, data, req) {
    try {
      console.log("aa")
      const quiz = this.prisma.quiz.findFirst({
        where: {
          id: data.id,
        },
      });
      if (!quiz) {
        throw new UnauthorizedException('email not found');
      }
      let img = '';
      if (file?.mainImg && file.mainImg.length > 0) {
        img = await create_photo(file.mainImg[0]);
      }
      const parsedAnswers = data.answer;
      parsedAnswers.map((answer) => console.log(JSON.parse(answer).isCorrect))

      const quest = await this.prisma.quest.create({
        data: {
          title: data.title,
          type: data.type,
          quizId: data.id,
          img: img,
          answers: {
            create: parsedAnswers.map((answer) => ({
              text: JSON.parse(answer).text,
              isCorrect: JSON.parse(answer).isCorrect,
            })),
          },
        },
        include: {
          answers: true,
        },
      });
      return quest
    } catch (e) {
      console.log(e)
      throw new NotFoundException(e);
    }
  }
}
