import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserVerifyMiddleware } from 'src/user-verify/user-verify.middleware';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserVerifyMiddleware).forRoutes(UserController);
  }
}
