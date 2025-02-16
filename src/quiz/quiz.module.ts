import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { UserVerifyMiddleware } from 'src/user-verify/user-verify.middleware';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
})
export class QuizModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserVerifyMiddleware)
      .exclude(
        { path: 'quiz/get', method: RequestMethod.GET },
{ path: 'quiz/getone', method: RequestMethod.GET }, 

      )
      .forRoutes(QuizController);
  }
}
