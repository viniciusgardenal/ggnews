import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from '../articles.service';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório.' })
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'O resumo é obrigatório.' })
  @MaxLength(500)
  excerpt: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo é obrigatório.' })
  content: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsInt()
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  category_id: number;

  @IsEnum(Status, { message: 'Status inválido.' })
  @IsNotEmpty({ message: 'O status é obrigatório.' })
  status: Status;

  @IsString()
  @IsOptional()
  published_at?: string;
}
