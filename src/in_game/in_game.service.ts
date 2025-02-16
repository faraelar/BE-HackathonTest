import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateInGameDto } from './dto/create-in_game.dto';
import { UpdateInGameDto } from './dto/update-in_game.dto';
import { PrismaService } from 'src/prisma.service';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { decode } from 'node:querystring';
import { SendAnswerDto } from './dto/sendAnswer.dto';

@Injectable()
export class InGameService {
  constructor(private prisma: PrismaService) { }
  async send_answer(data: SendAnswerDto, timers: any, client: Socket, user_id: string) {
    const room = await this.find_room(data.id)
    const current_quest = room.quest.find((elem) => elem.id == room.currentQuest)
    const user_answer = current_quest?.answers.find((elem) => elem.id == data.answer)
    if (user_answer) {
      this.confirm_answer(user_answer.isCorrect, timers[data.id].timer, user_id, data.id)
    }


    clearInterval(timers[data.id].interval)
    this.next_step(timers[data.id])

  }
  async end_game(room: any) {
    const new_room = await this.prisma.room.findFirst({
      where: {
        id: room.room_id
      },
      include: {
        userInRoom: true,
      },
    })
    await this.quest_complete(new_room)

    room.user.map((elem) => {
      const res = {
        new_room
      }
      return elem.socket.emit('end_quiz', res)
    })

  }
  async quest_complete(room: any) {
    console.log(room)
    const data = await Promise.allSettled(
      room.userInRoom.map(elem =>
        this.prisma.questComplete.create({
          data: {
            correctAnswer: elem.correctAnswer,
            time: elem.time,
            timeStart: new Date().toISOString(),
            userId: elem.userId,
            quizId: room.quizInRoomId
          }
        })
      )
    );
    console.log(data)

  }
  async next_step(room) {
    const new_room_quest = await this.change_quest(room.room_id);
    if (!new_room_quest) {
      clearInterval(room.interval);


      const emt = await this.end_game(room)
      await this.prisma.$transaction([
        this.prisma.userInRoom.deleteMany({
          where: { roomId: room.room_id }
        }),
        this.prisma.room.delete({
          where: { id: room.room_id }
        })
      ]);
      room = null

      return emt;
    }

    const user_in_room = await this.get_user_in_room(room.room_id)
    const user = user_in_room?.userInRoom.map((elem) => {
      return {
        ...elem,
        time: !elem.state ? elem.time + room.timer : elem.time,
        state: false
      };
    });
    await this.prisma.room.update({
      where: { id: room.room_id },
      data: {
        userInRoom: {
          updateMany: user?.map((user) => ({
            where: { id: user.id },
            data: {
              time: user.time,
              state: user.state,
            },
          })),
        },
      },
    });
    const current_quest = new_room_quest.quest.find((elem) => elem.id == new_room_quest.currentQuest)
    const quest = await this.reforme_quest(current_quest)
    if (!quest) {
      clearInterval(room.interval);
    }
    room.user.map((elem) => {

      const res = {
        user,
        quest
      }
      elem.socket.emit('next_question', res)
    })
    room.timer = -10
    clearInterval(room.interval)
    room.interval = setInterval(async () => {

      room.timer++
      if (room.timer >= room.time) {
        this.next_step(room)
      }
    }, 1000)

  }


  async send_quest(data: CreateInGameDto, timers: any, client: Socket, user_id: string) {
    const room = await this.find_room(data.id)

    if (!timers[data.id]) {
      timers[data.id] = {
        time: room?.time ?? 30,
        timer: 0,
        user: [],
        state: false,
        room_id: data.id,
        interval: setInterval(async () => {

          timers[data.id].timer++
          console.log("aa")
          if (timers[data.id].timer >= timers[data.id].time) {
            this.next_step(timers[data.id])
          }
        }, 1000)
      };
    }
    const user = timers[data.id].user.find(u => u.user_id === user_id);

    if (!user) {

      timers[data.id].user.push({
        status: false,
        socket: client,
        user_id: user_id
      })
    } else {
      user.socket = client;

    }
    if (!room.currentQuest || room.currentQuest == "") {
      const quest = room.quest[0];
      await this.new_current_quest(quest.id, room.id)

      const updatedData = this.reforme_quest(quest)

      return updatedData
    }
    const quest = await this.prisma.quest.findFirst({
      where: {
        id: room.currentQuest
      },
      include: {
        answers: true,
      }
    })
    if (!quest) {
      throw new UnauthorizedException('Token is required');
    }
    const updatedData = this.reforme_quest(quest)



    return updatedData

    timers[data.id].timers = setTimeout(() => {

    },)
  }
  async check_all_user() { }
  async get_user_in_room(room_id: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: room_id
      },
      include: {
        userInRoom: true
      }
    })
    return room;

  }
  async confirm_answer(state_answer: boolean, time: number, user_id: string, room_id: string): Promise<void> {
    try {
      const userInRoom = await this.prisma.userInRoom.findFirst({
        where: { userId: user_id, roomId: room_id },
      })
      if (!userInRoom) {
        return
      }
      let correct = state_answer ? 1 : 0
      const correctAnswer = userInRoom.correctAnswer + correct
      await this.prisma.userInRoom.update({
        where: { userId: user_id, roomId: room_id },
        data: {
          correctAnswer: correctAnswer,
          time: userInRoom.time + Math.abs(time),
          state: true
        }
      });
    } catch (error) {
      console.error(`Error updating answer confirmation for user ${user_id}:`, error);
      throw new Error('Failed to update user answer confirmation');
    }
  }

  async reforme_quest(quest: any) {
    if (!quest) {
      return null
    }

    const updatedData = {
      ...quest,
      answers: quest.answers.map(({ isCorrect, ...rest }) => rest)
    };
    return updatedData;
  }
  async find_room(room_id: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: room_id
      },
      include: {
        quest: {
          include: {
            answers: true,
          }

        },
        quizInRoom: true,
      },
    })
    if (!room) {
      throw new UnauthorizedException('Token is required');
    }
    return room
  }
  async change_quest(room_id: string): Promise<any | null> {
    const room = await this.find_room(room_id)
    if (!room.currentQuest) {
      return
    }
    const currentQuestIndex = room.quest.findIndex(q => q.id === room.currentQuest);
    const nextQuest = room.quest[currentQuestIndex + 1];
    if (!nextQuest) {
      return null
    }
    const updatedRoom = await this.prisma.room.update({
      where: { id: room_id },
      data: { currentQuest: nextQuest.id },
      include: {
        quest: {
          include: {
            answers: true,
          }
        }
      },

    });

    return updatedRoom
  }
  async new_current_quest(quest_id: string, room_id: string) {
    await this.prisma.room.update({
      where: {
        id: room_id
      },
      data: {
        currentQuest: quest_id
      }
    })
  }

  async get_user(data: CreateInGameDto) {
    try {
      const token = data.token
      if (!token) {
        throw new UnauthorizedException('Token is required');
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      if (!decoded) {
        throw new UnauthorizedException('Token is required');
      }
      return decoded.id

    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

  }
}
