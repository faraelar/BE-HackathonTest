import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import * as Multer from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserChangeDto } from './dto/userChangeName.dto';

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  async get_user(@Req() req: any) {
    return this.userService.get_user(req);
  }
  @Post("changename")
  async change_name(@Body() data:UserChangeDto ,@Req() req: any){
    return this.userService.change_name(data,req)
  }
}
