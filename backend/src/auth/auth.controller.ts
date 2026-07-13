import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('admin')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // JWT is stateless; client revokes token locally. 
    // Return confirmation status matching previous controller logic.
    return { message: 'Desconectado com sucesso.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}
