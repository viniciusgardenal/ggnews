import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticlesModule } from './articles/articles.module';
import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ArticlesModule,
    SettingsModule,
    UploadModule,
  ],
})
export class AppModule {}
