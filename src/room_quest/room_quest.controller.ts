import { Controller, Post, Body, Req } from '@nestjs/common';
import { CreateRoomDto } from "./dto/createRoom.dto"
import { RoomQuestService } from './room_quest.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('room-quest')
@ApiTags('room-quest')
export class RoomQuestController {
  constructor(private readonly roomQuestService: RoomQuestService) { }
  @Post("createroom")
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateRoomDto,
    description:
      'The data for the new quiz, including a file upload for the main image.',
  })
  async create_room(@Body() data: CreateRoomDto, @Req() req: any) {
    return this.roomQuestService.create_room(data, req)
  }


}
