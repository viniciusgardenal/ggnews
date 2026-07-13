import { Controller, Get, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.AUTHOR)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async getDashboardStats() {
    return this.articlesService.getDashboardStats();
  }
}
