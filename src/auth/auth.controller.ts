import { AuthService } from './auth.service';
import { IRegistretion } from './dto/register.dto';
import { IEndRegister } from './dto/end_register.dto';
import { ILogin } from './dto/login.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/auth.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'register' })
  @ApiBody({ type: IRegistretion })
  registretion(
    @Body() data: IRegistretion,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(data, res);
  }

  @Get('sendemail')
  @UseGuards(JwtAuthGuard)
  send_email(@Req() req: any) {
    return this.authService.send_email(req);
  }

  @Get('resendemail')
  @UseGuards(JwtAuthGuard)
  resend_email(@Req() req: any) {
    return this.authService.resend_email(req);
  }

  @Post('endregister')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  end_register(
    @Req() req: any,
    @Body() data: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.end_register(req, data, res);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() data: ILogin, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(data, res);
  }
  @Get("get_token")
  get_token(@Query("token") token: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.get_token(token, res);
  }
}
