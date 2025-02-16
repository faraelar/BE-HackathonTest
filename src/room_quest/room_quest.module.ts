import { RoomQuestService } from './room_quest.service';
import { RoomQuestController } from './room_quest.controller';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';    
import { UserVerifyMiddleware } from 'src/user-verify/user-verify.middleware'; 
import { PrismaService } from '../prisma.service';                             

@Module({
  controllers: [RoomQuestController],
  providers: [RoomQuestService,PrismaService],
})
export class RoomQuestModule {
    configure(consumer: MiddlewareConsumer) {              
    consumer                                             
      .apply(UserVerifyMiddleware)                       
      .exclude(                                          
        { path: 'quiz/get', method: RequestMethod.GET }, 
      )                                                  
      .forRoutes(RoomQuestController);                        
  }                                                      

}
