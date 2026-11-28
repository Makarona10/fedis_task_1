import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { resObj } from 'src/common/helpers';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Payload } from './interfaces/payload.interface';
import { LocalAuthGuard } from './guards/jwt-local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(body);
    return resObj(201, 'User Registered Successfully', result);
  }

  @Post('admin/register')
  async adminRegister(@Body() body: RegisterDto) {
    const result = await this.authService.register(body, 'ADMIN');
    return resObj(201, 'Admin Registered Successfully', result);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(
    @Req() req: Request & { user: Payload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(req.user as Payload, res);
    return resObj(200, 'Login successfully', response);
  }

  @Post('admin/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async adminLogin(
    @Req() req: Request & { user: Payload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(req.user as Payload, res);
    return resObj(200, 'Login successfully', response);
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req?.cookies['refresh_token'];
    if (!refresh_token) throw new UnauthorizedException('No refresh token');
    const user = await this.authService.decodeToken(refresh_token);
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    const isValid = await this.authService.validateRefreshToken(refresh_token);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    return this.authService.login(user, res);
  }
}
