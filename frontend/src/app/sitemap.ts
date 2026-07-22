import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Dynamic Category routes
    const categories = await api.getCategories().catch(() => []);
    categories.forEach((cat) => {
      routes.push({
        url: `${baseUrl}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });

    // Dynamic Article routes
    const articlesResponse = await api.getArticles({ per_page: 50 }).catch(() => ({ data: [] }));
    articlesResponse.data.forEach((article) => {
      routes.push({
        url: `${baseUrl}/${article.category.slug}/${article.slug}`,
        lastModified: new Date(article.updated_at || article.published_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
