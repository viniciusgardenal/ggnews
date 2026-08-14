import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { Request } from 'express';
import * as fs from 'fs';
import * as crypto from 'crypto';

const ALLOWED_MIME_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.AUTHOR)
@Controller('admin/upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'public', 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Derive safe extension strictly from verified MIME whitelist
          const safeExt = ALLOWED_MIME_MAP[file.mimetype] || '.jpg';
          const randomId = crypto.randomBytes(12).toString('hex');
          cb(null, `${Date.now()}-${randomId}${safeExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_MAP[file.mimetype]) {
          return cb(
            new BadRequestException('Apenas imagens nos formatos JPG, PNG, WebP e GIF são permitidas.'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Max 5MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado ou arquivo inválido.');
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/uploads/${file.filename}`;

    return {
      url,
      message: 'Arquivo enviado com sucesso.',
    };
  }
}
