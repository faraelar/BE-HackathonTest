import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ILogin } from './dto/login.dto';
import { IRegistretion } from './dto/register.dto';
import { IEndRegister } from './dto/end_register.dto';
import { PrismaService } from 'src/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/utils/generateToken';
import { Emailsend } from 'src/utils/sendler_email';
const emailSend = new Emailsend();
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async register(data: IRegistretion, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (user) {
        throw new NotFoundException('this email was used');
      }
      console.log('aaa');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          iconImg: '',
          isAlowed: false,
          emailStatus: false,
          code: '',
          yourQuiz: { connect: [] },
          userRating: 0,
          authorRating: 0,
          questComplete: { connect: [] },
        },
      });
      console.log('aaa');

      const temporaryToken = await generateToken({
        id: newUser.id,
        secret: process.env.TEMPORARY_TOKEN ?? 'ff',
        time: '15m',
      });
      console.log(temporaryToken);
      //    const token = jwt.sign({ id: newUser.id }, process.env.SECRET, {
      //  expiresIn: '1h',
      //  });
      await res.cookie('temporarytoken', temporaryToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      console.log('ept');
      return 'This action returns all cats';
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
  async login(data: ILogin, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new NotFoundException('This email is not registered');
      }
      if (user.password == '') {
        throw new NotFoundException('enter by google');
      }
      const verifyPassword = bcrypt.compareSync(data.password, user.password);

      if (!verifyPassword) {
        throw new UnauthorizedException('Incorrect email or password');
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: '24h',
      });
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return token;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
  async send_email(req: any) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: req.user },
      });
      if (!user || user.emailStatus) {
        throw new UnauthorizedException('email not found');
      }
      const code = Math.floor(Math.random() * 9999);
      let hashCode = bcrypt.hashSync(code.toString(), 6);
      await this.prisma.user.update({
        where: { id: req.user },
        data: {
          code: hashCode,
          emailStatus: true,
        },
      });
      const data = {
        email: user.email,
        code: code,
      };
      await emailSend.sendmessage({ data });
      return 'email send successful';
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async resend_email(req: any) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: req.user },
      });
      if (!user) {
        throw new UnauthorizedException('email not found');
      }
      const code = Math.floor(Math.random() * 9999);
      let hashCode = bcrypt.hashSync(code.toString(), 6);
      await this.prisma.user.update({
        where: { id: req.user },
        data: {
          code: hashCode,
          emailStatus: true,
        },
      });
      const data = {
        email: user.email,
        code: code,
      };
      await emailSend.sendmessage({ data });
      return 'email send successful';
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async end_register(req: any, data: any, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: req.user },
      });
      if (!user) {
        throw new UnauthorizedException('email not found');
      }
      const verifyPassword = bcrypt.compareSync(data.code, user.code);
      if (!verifyPassword) {
        throw new UnauthorizedException('Incorrect code');
      }
      await this.prisma.user.update({
        where: { id: req.user },
        data: {
          isAlowed: true,
        },
      });
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: '24h',
      });
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });
      return '';
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async get_token(token: any, res: Response) {
    try {
      return res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }

  }
}
