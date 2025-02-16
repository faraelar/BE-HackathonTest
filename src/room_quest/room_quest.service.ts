import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from "./dto/createRoom.dto"
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoomQuestService {
  constructor(private prisma: PrismaService) { }
  async create_room(data: CreateRoomDto, req) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: data.id_quiz },
        include: { quests: { include: { answers: true } } }
      });

      if (!quiz || !quiz.quests || quiz.quests.length === 0) {
        throw new NotFoundException("Cannot find quiz or this quiz doesn't have questions.");
      }

      const newRoom = await this.prisma.room.create({
        data: {
          quizInRoomId: data.id_quiz,
          questId: quiz.quests.map((quest) => quest.id),
          currentQuest: "",
          time: quiz.time,
          userInRoom: {
            create: [
              {
                userId: req.id,
                correctAnswer: 0,
                time: 0,
              },
            ],
          },

        },
      });

      return { newRoom, token: req.cookies.token }
    } catch (e) {
      console.log(e)
      throw new NotFoundException(e);
    }

  }
}
