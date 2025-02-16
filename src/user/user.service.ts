import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async get_user(req) {
    try {
      console.log("a'")
      const user = this.prisma.user.findFirst({
        where: {
          id: req.id,
        },
        include: { yourQuiz: true, questComplete: true },
      });
      console.log("a")
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (e) {
      console.log(e)
      throw new NotFoundException(e);
    }
  }
  async change_name(data, req) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: req.id
        },
        data: {
          name: data.name
        }
      })
      return user
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}
