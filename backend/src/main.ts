import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure prefix api/v1 for route endpoints
  app.setGlobalPrefix('api/v1');

  // Enable CORS for our Next.js frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global pipe for input validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve uploads directory statically at /uploads
  // Create uploads folder inside public if not exists
  const publicDir = join(__dirname, '..', 'public');
  app.use('/uploads', express.static(join(publicDir, 'uploads')));

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
