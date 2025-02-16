import { InGameService } from './in_game.service';
import { InGameGateway } from './in_game.gateway';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserVerifyMiddleware } from 'src/user-verify/user-verify.middleware';
import { PrismaService } from '../prisma.service';


@Module({
  providers: [InGameGateway, InGameService, PrismaService],
})
export class InGameModule {

}
