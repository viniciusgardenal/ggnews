import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@Controller()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('settings')
  async getSettings() {
    return this.settingsService.getPublicSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUTHOR)
  @Put('admin/settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    const settings = await this.settingsService.updateSettings(dto);
    return {
      message: 'Configurações atualizadas com sucesso.',
      settings,
    };
  }
}
