import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60; // Refresh index page cache every 60s

export default async function HomePage() {
  let featuredArticle: any = null;
  let latestArticles: any[] = [];
  let categories: any[] = [];

  try {
    // Fetch featured article, latest feed, and categories concurrently
    const [fetchedFeatured, fetchedArticles, fetchedCategories] = await Promise.all([
      api.getFeaturedArticle().catch(() => null),
      api.getArticles({ per_page: 7 }),
      api.getCategories().catch(() => []),
    ]);

    featuredArticle = fetchedFeatured;
    categories = fetchedCategories;
    
    // Filter out the featured article from the latest feed to avoid duplicate display
    latestArticles = fetchedArticles.data.filter(
      (article) => article.id !== featuredArticle?.id
    ).slice(0, 6);

  } catch (error) {
    console.error('Failed to load homepage feeds:', error);
  }

  const featuredDate = featuredArticle 
    ? new Date(featuredArticle.published_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* 1. Hero Section (Notícia Destaque) */}
      {featuredArticle && (
        <section className="mb-12">
          <div className="group relative overflow-hidden rounded-2xl border border-[#1f2833]/60 bg-[#0b0c10] neon-border">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Cover Image Block */}
              <div className="lg:col-span-7 relative aspect-video lg:aspect-auto lg:h-[480px] overflow-hidden">
                <img
                  src={featuredArticle.cover_image || '/images/placeholder-game.jpg'}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/40 to-transparent" />
                <span className="absolute left-6 top-6 rounded bg-rose-600 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-xl">
                  {featuredArticle.category.name}
                </span>
              </div>

              {/* Title & Excerpt Content Block */}
              <div className="lg:col-span-5 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="font-bold text-slate-400">{featuredArticle.author.name}</span>
                  <span>•</span>
                  <time dateTime={featuredArticle.published_at}>{featuredDate}</time>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 group-hover:text-[#66fcf1] transition-colors duration-200">
                  <Link href={`/${featuredArticle.category.slug}/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h1>

                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>

                <div>
                  <Link
                    href={`/${featuredArticle.category.slug}/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 rounded bg-rose-600 hover:bg-rose-700 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-200"
                  >
                    Ler Matéria Completa
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. Grid of Latest News (Últimas Notícias) */}
      <section className="mb-16">
        <div className="flex items-center justify-between border-b border-[#1f2833]/40 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
            Últimas <span className="text-[#66fcf1]">Notícias</span>
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-[#66fcf1]/60 to-transparent ml-6 rounded-full max-w-[200px]" />
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#1f2833]/60 p-12 text-center text-slate-500">
            Nenhuma notícia publicada encontrada no momento.
          </div>
        )}
      </section>

      {/* 3. Section Segments by Categories */}
      {categories.slice(0, 2).map((category) => (
        <section key={category.id} className="mb-16">
          <div className="flex items-center justify-between border-b border-[#1f2833]/40 pb-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
              Categoria: <span className="text-rose-500">{category.name}</span>
            </h2>
            <Link 
              href={`/${category.slug}`}
              className="text-xs font-bold uppercase tracking-wider text-[#66fcf1] hover:text-white transition-colors duration-200"
            >
              Ver Tudo
            </Link>
          </div>

          {/* Let's show a list or horizontal card scroll placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Typically we could fetch specific articles for this category.
                For index render, we query them. If they are in database, list them. */}
            <div className="rounded-xl border border-dashed border-[#1f2833]/40 p-8 text-center text-xs text-slate-600 col-span-2">
              Visite a página da categoria <Link href={`/${category.slug}`} className="text-[#66fcf1] underline">{category.name}</Link> para ver todas as matérias relacionadas.
            </div>
          </div>
        </section>
      ))}

    </div>
  );
}
