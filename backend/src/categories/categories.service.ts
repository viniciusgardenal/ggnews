import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
  }

  // Public: List categories for menu
  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Admin: List categories with article counts
  async findAllWithArticlesCount() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: 'asc' },
    }).then((cats) =>
      cats.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        articles_count: c._count.articles,
      })),
    );
  }

  // Public: Get category and published articles (paginated)
  async findBySlug(slug: string, page = 1, perPage = 12) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const skip = (page - 1) * perPage;
    
    // Query published articles under this category
    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
        },
        include: {
          category: true,
          author: { select: { id: true, name: true, role: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.article.count({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
        },
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      category,
      articles: {
        current_page: page,
        data: articles.map(art => ({
          ...art,
          cover_image: art.coverImage // Mapping camelCase to snake_case for frontend compatibility
        })),
        last_page: lastPage,
        per_page: perPage,
        total,
        next_page_url: page < lastPage ? `/${category.slug}?page=${page + 1}` : null,
        prev_page_url: page > 1 ? `/${category.slug}?page=${page - 1}` : null,
      },
    };
  }

  // Admin: Create category
  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);
    
    const exists = await this.prisma.category.findUnique({ where: { slug } });
    if (exists) {
      throw new BadRequestException('Já existe uma categoria registrada com esta URL (slug).');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  // Admin: Update category
  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const slug = this.slugify(dto.slug);
    const exists = await this.prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });
    
    if (exists) {
      throw new BadRequestException('Já existe outra categoria registrada com esta URL (slug).');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  // Admin: Delete category
  async remove(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    // Check if category contains articles
    const articleCount = await this.prisma.article.count({
      where: { categoryId: id },
    });
    
    if (articleCount > 0) {
      throw new BadRequestException(
        `Não é possível excluir esta categoria pois ela possui ${articleCount} artigos vinculados.`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Categoria excluída com sucesso.' };
  }
}
