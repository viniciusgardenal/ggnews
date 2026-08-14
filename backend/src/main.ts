import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

// In-memory rate limiting map for login protection
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_LOGIN_ATTEMPTS = 10; // Max 10 attempts per minute per IP

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Login Rate Limiter Middleware
  app.use('/api/v1/admin/login', (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST') return next();

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const attemptRecord = loginAttempts.get(clientIp);

    if (!attemptRecord || (now - attemptRecord.firstAttempt) > RATE_LIMIT_WINDOW_MS) {
      loginAttempts.set(clientIp, { count: 1, firstAttempt: now });
      return next();
    }

    if (attemptRecord.count >= MAX_LOGIN_ATTEMPTS) {
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Muitas tentativas de login consecutivas. Aguarde 1 minuto e tente novamente.',
        error: 'Too Many Requests',
      });
    }

    attemptRecord.count += 1;
    next();
  });

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
  const publicDir = join(__dirname, '..', 'public');
  app.use('/uploads', express.static(join(publicDir, 'uploads')));

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
