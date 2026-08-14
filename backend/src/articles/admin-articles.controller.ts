import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ArticlesService, Status } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.AUTHOR)
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async listAll(
    @Query('page') page?: string,
    @Query('q') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('status') status?: Status,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const catId = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.articlesService.findAdminAll(pageNum, search, catId, status);
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findAdminOne(id);
  }

  @Post()
  async create(@Body() dto: CreateArticleDto, @Request() req) {
    const article = await this.articlesService.create(dto, req.user.id);
    return {
      message: 'Artigo criado com sucesso.',
      article,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
    @Request() req,
  ) {
    const article = await this.articlesService.update(id, dto, req.user);
    return {
      message: 'Artigo atualizado com sucesso.',
      article,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.articlesService.remove(id, req.user);
  }
}
