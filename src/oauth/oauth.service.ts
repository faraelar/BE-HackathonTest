import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateToken } from 'src/utils/generateToken';

@Injectable()
export class OauthService {
  constructor(private prisma: PrismaService) {}

  async validateGoogleUser(data) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });
      if (user) return user;
      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          iconImg: data.avatarUrl,
          password: '',
          isAlowed: false,
          emailStatus: false,
          code: '',
          yourQuiz: { connect: [] },
          userRating: 0,
          authorRating: 0,
          questComplete: { connect: [] },
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async login(user) {
    const token = await generateToken({
      id: user.id,
      secret: process.env.SECET ?? 'ff',
      time: '1h',
    });
    return token;
  }
}
