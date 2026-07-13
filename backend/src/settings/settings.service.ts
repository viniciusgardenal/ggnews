import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private parseSettingValue(value: string | null, defaultValue: any): any {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  // Get specific public settings (or default fallbacks)
  async getPublicSettings() {
    const keys = [
      'site_name',
      'site_description',
      'logo_url',
      'contact_email',
      'footer_links',
      'social_links',
    ];

    const records = await this.prisma.setting.findMany({
      where: { key: { in: keys } },
    });

    const settingsMap = records.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as { [key: string]: string | null });

    return {
      site_name: settingsMap['site_name'] || 'GG News',
      site_description:
        settingsMap['site_description'] || 'O seu portal definitivo de notícias gamer.',
      logo_url: settingsMap['logo_url'] || null,
      contact_email: settingsMap['contact_email'] || 'contato@ggnews.com',
      footer_links: this.parseSettingValue(settingsMap['footer_links'], [
        { title: 'Sobre Nós', url: '/sobre' },
        { title: 'Contato', url: '/contato' },
        { title: 'Termos de Uso', url: '/termos' },
      ]),
      social_links: this.parseSettingValue(settingsMap['social_links'], [
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'youtube', url: 'https://youtube.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
      ]),
    };
  }

  // Save configurations in batch
  async updateSettings(dto: UpdateSettingsDto) {
    const payloadMap: { [key: string]: any } = {
      site_name: dto.site_name,
      site_description: dto.site_description,
      logo_url: dto.logo_url || null,
      contact_email: dto.contact_email || null,
      footer_links: dto.footer_links ? JSON.stringify(dto.footer_links) : null,
      social_links: dto.social_links ? JSON.stringify(dto.social_links) : null,
    };

    for (const key of Object.keys(payloadMap)) {
      const val = payloadMap[key];
      await this.prisma.setting.upsert({
        where: { key },
        update: { value: val },
        create: { key, value: val },
      });
    }

    return this.getPublicSettings();
  }
}
