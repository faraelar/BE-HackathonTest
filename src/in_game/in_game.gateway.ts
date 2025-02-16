import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { InGameService } from './in_game.service';
import { CreateInGameDto } from './dto/create-in_game.dto';
import { SendAnswerDto } from './dto/sendAnswer.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/game',
})
export class InGameGateway {
  private timers = new Map<string, NodeJS.Timeout>();
  constructor(private readonly inGameService: InGameService) { }

  @SubscribeMessage("start_question")
  async create(@MessageBody() data: CreateInGameDto, @ConnectedSocket() client: Socket) {
    console.log("fuck")

    const id = await this.inGameService.get_user(data)
    const res = await this.inGameService.send_quest(data, this.timers, client, id);
    console.log("fuck")
    client.emit('start_question', res);
  }
  @SubscribeMessage("send_answer")
  async send_answer(@MessageBody() data: SendAnswerDto, @ConnectedSocket() client: Socket) {


    const id = await this.inGameService.get_user(data)
    const res = await this.inGameService.send_answer(data, this.timers, client, id);
    return;
  }

}
