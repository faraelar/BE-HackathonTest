import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserVerifyMiddleware } from 'src/user-verify/user-verify.middleware';
import { PrismaService } from '../prisma.service';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';

@Module({
  controllers: [QuestController],
  providers: [QuestService, PrismaService],
})
export class QuestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserVerifyMiddleware).forRoutes(QuestController);
  }
}
