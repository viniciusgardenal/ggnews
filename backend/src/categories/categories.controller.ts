import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  async getCategoryBySlug(
    @Param('slug') slug: string,
    @Query('page') page?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    return this.categoriesService.findBySlug(slug, pageNum);
  }
}
