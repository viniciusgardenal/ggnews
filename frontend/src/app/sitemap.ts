import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const parseSafeDate = (dateVal: any): Date => {
  if (!dateVal) return new Date();
  const date = new Date(dateVal);
  return isNaN(date.getTime()) ? new Date() : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/anuncie`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Dynamic Category routes
    const categories = await api.getCategories().catch(() => []);
    if (Array.isArray(categories)) {
      categories.forEach((cat) => {
        if (cat?.slug) {
          routes.push({
            url: `${baseUrl}/${cat.slug}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
          });
        }
      });
    }

    // Dynamic Article routes
    const articlesResponse = await api.getArticles({ per_page: 50 }).catch(() => ({ data: [] }));
    if (Array.isArray(articlesResponse?.data)) {
      articlesResponse.data.forEach((article) => {
        if (article?.slug && article?.category?.slug) {
          routes.push({
            url: `${baseUrl}/${article.category.slug}/${article.slug}`,
            lastModified: parseSafeDate(article.updated_at || article.published_at),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
