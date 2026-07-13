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
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { Request } from 'express';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.AUTHOR)
@Controller('admin/upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Resolve public/uploads path dynamically
          const uploadPath = join(__dirname, '..', '..', 'public', 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate unique filename with original extension
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Enforce image mime types
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Apenas imagens (jpg, png, gif, webp) são permitidas.'), false);
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

    // Generate absolute URL using request host details
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/uploads/${file.filename}`;

    return {
      url,
      message: 'Arquivo enviado com sucesso.',
    };
  }
}
