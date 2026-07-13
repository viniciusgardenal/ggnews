import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from '@prisma/client';

export enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Injectable()
export class ArticlesService {
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

  // ================= PUBLIC SERVICES =================

  async findPublished(page = 1, categorySlug?: string, search?: string, perPage = 12) {
    const skip = (page - 1) * perPage;
    
    // Base filter: must be published and in the past
    const where: any = {
      status: Status.PUBLISHED,
      publishedAt: { lte: new Date() },
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, role: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.article.count({ where }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      current_page: page,
      data: articles.map((art) => ({
        ...art,
        cover_image: art.coverImage,
      })),
      last_page: lastPage,
      per_page: perPage,
      total,
      next_page_url: page < lastPage ? `/articles?page=${page + 1}` : null,
      prev_page_url: page > 1 ? `/articles?page=${page - 1}` : null,
    };
  }

  async findFeatured() {
    const featured = await this.prisma.article.findFirst({
      where: {
        status: Status.PUBLISHED,
        publishedAt: { lte: new Date() },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });

    if (!featured) {
      throw new NotFoundException('Nenhum artigo em destaque encontrado.');
    }

    return {
      ...featured,
      cover_image: featured.coverImage,
    };
  }

  async findBySlug(categorySlug: string, slug: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        slug,
        status: Status.PUBLISHED,
        publishedAt: { lte: new Date() },
        category: { slug: categorySlug },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
      },
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado.');
    }

    return {
      ...article,
      cover_image: article.coverImage,
    };
  }

  // ================= ADMIN SERVICES =================

  async findAdminAll(page = 1, search?: string, categoryId?: number, status?: Status, perPage = 10) {
    const skip = (page - 1) * perPage;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.article.count({ where }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      current_page: page,
      data: articles.map((art) => ({
        ...art,
        cover_image: art.coverImage,
      })),
      last_page: lastPage,
      per_page: perPage,
      total,
    };
  }

  async findAdminOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
      },
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado.');
    }

    return {
      ...article,
      cover_image: article.coverImage,
    };
  }

  async create(dto: CreateArticleDto, authorId: number) {
    let slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.title);
    
    // Handle duplicate slugs
    let originalSlug = slug;
    let count = 1;
    while (await this.prisma.article.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${count++}`;
    }

    const publishedAt =
      dto.status === Status.PUBLISHED
        ? dto.published_at
          ? new Date(dto.published_at)
          : new Date()
        : null;

    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.cover_image || null,
        status: dto.status,
        publishedAt,
        categoryId: dto.category_id,
        authorId,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
      },
    });

    return {
      ...article,
      cover_image: article.coverImage,
    };
  }

  async update(id: number, dto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('Artigo não encontrado.');
    }

    const slug = this.slugify(dto.slug);
    const slugExists = await this.prisma.article.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (slugExists) {
      throw new BadRequestException('Já existe outro artigo com esta URL (slug).');
    }

    const publishedAt =
      dto.status === Status.PUBLISHED
        ? dto.published_at
          ? new Date(dto.published_at)
          : article.publishedAt || new Date()
        : null;

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.cover_image || null,
        status: dto.status,
        publishedAt,
        categoryId: dto.category_id,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
      },
    });

    return {
      ...updated,
      cover_image: updated.coverImage,
    };
  }

  async remove(id: number) {
    const exists = await this.prisma.article.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Artigo não encontrado.');
    }

    await this.prisma.article.delete({ where: { id } });
    return { message: 'Artigo excluído com sucesso.' };
  }

  // Dashboard Stats Consolidation
  async getDashboardStats() {
    const [totalArticles, publishedArticles, draftArticles, totalCategories] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.article.count({ where: { status: Status.PUBLISHED } }),
      this.prisma.article.count({ where: { status: Status.DRAFT } }),
      this.prisma.category.count(),
    ]);

    const recentArticles = await this.prisma.article.findMany({
      include: {
        category: { select: { name: true } },
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      stats: {
        total_articles: totalArticles,
        published_articles: publishedArticles,
        draft_articles: draftArticles,
        total_categories: totalCategories,
      },
      recent_articles: recentArticles.map((art) => ({
        ...art,
        cover_image: art.coverImage,
      })),
    };
  }
}
