import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('As credenciais fornecidas estão incorretas.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('As credenciais fornecidas estão incorretas.');
    }

    // Auth validation check: Admins and Authors are allowed
    if (user.role !== 'ADMIN' && user.role !== 'AUTHOR') {
      throw new UnauthorizedException('Acesso negado. Apenas administradores e autores possuem acesso.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
