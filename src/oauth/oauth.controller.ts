import { OauthService } from './oauth.service';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
@Controller('auth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.oauthService.login(req.user);
    res.redirect(`${process.env.PORT_FRONTEND}?token=${response}`);
  }
}
