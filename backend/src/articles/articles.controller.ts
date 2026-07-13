import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async getArticles(
    @Query('category') category?: string,
    @Query('q') search?: string,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limit = perPage ? parseInt(perPage, 10) : 12;
    return this.articlesService.findPublished(pageNum, category, search, limit);
  }

  @Get('featured')
  async getFeatured() {
    return this.articlesService.findFeatured();
  }

  @Get(':categorySlug/:slug')
  async getArticleBySlug(
    @Param('categorySlug') categorySlug: string,
    @Param('slug') slug: string,
  ) {
    return this.articlesService.findBySlug(categorySlug, slug);
  }
}
