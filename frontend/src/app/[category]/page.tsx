import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, ArrowRight, Zap, FolderOpen } from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const data = await api.getCategoryBySlug(params.category);
    return {
      title: `${data.category.name} | NEXUS`,
      description: `Cobertura completa, notícias e análises sobre ${data.category.name} no NEXUS.`,
    };
  } catch (error) {
    return {
      title: 'Categoria | NEXUS',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = Number(searchParams?.page || '1');
  let categoryData: any = null;

  try {
    categoryData = await api.getCategoryBySlug(params.category, currentPage);
  } catch (error) {
    console.error('Failed to load category articles:', error);
  }

  // Clean Fallback demo data
  if (!categoryData) {
    const defaultCategories: Record<string, string> = {
      games: 'Games',
      playstation: 'PlayStation',
      xbox: 'Xbox',
      nintendo: 'Nintendo',
      'pc-gaming': 'PC Gaming',
      reviews: 'Reviews',
      lancamentos: 'Lançamentos',
    };

    const catName = defaultCategories[params.category] || params.category;
    categoryData = {
      category: { id: 1, name: catName, slug: params.category },
      articles: {
        current_page: 1,
        last_page: 1,
        total: 1,
        data: [
          {
            id: 1,
            title: `${catName}: Destaque Principal e Novidades da Categoria`,
            slug: 'gta-6-gameplay-trailer-analise',
            excerpt: 'Confira as últimas novidades, lançamentos e matérias mais importantes da nossa redação.',
            cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
            published_at: new Date().toISOString(),
            views_count: 12500,
            author: { name: 'Redação NEXUS' },
            category: { name: catName, slug: params.category },
          }
        ],
        prev_page_url: null,
        next_page_url: null,
      }
    };
  }

  const { category, articles } = categoryData;
  const featuredCategoryArticle = articles.data[0];
  const listCategoryArticles = articles.data.slice(1);

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      
      {/* Category Clean Header */}
      <header className="p-6 sm:p-10 rounded-3xl floating-glass border border-slate-200 dark:border-cyan-500/25 relative overflow-hidden shadow-sm">
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">Categorias</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">{category.name}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Categoria</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
                {category.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Artigos</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-base">{articles.total || articles.data.length} matérias</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Confira as últimas novidades, notícias e análises completas da categoria {category.name}.
          </p>
        </div>
      </header>

      {/* Featured Article in Category */}
      {featuredCategoryArticle && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Destaque da Categoria</span>
          </div>
          <ArticleCard article={featuredCategoryArticle} variant="panoramic" index={1} />
        </section>
      )}

      {/* Articles Grid */}
      {listCategoryArticles.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold uppercase text-slate-900 dark:text-white tracking-tight">
              Mais Matérias
            </h2>
            <span className="text-xs text-slate-500">Mais recentes primeiro</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listCategoryArticles.map((article: any, idx: number) => (
              <ArticleCard key={article.id} article={article} index={idx + 2} />
            ))}
          </div>
        </section>
      )}

      {/* Pagination */}
      {articles.last_page > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
          {articles.prev_page_url ? (
            <Link
              href={`/${category.slug}?page=${currentPage - 1}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </Link>
          ) : (
            <span className="opacity-40 cursor-not-allowed flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </span>
          )}

          <span className="px-4 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-sm">
            Página <span className="text-cyan-600 dark:text-cyan-400 font-bold">{articles.current_page}</span> de {articles.last_page}
          </span>

          {articles.next_page_url ? (
            <Link
              href={`/${category.slug}?page=${currentPage + 1}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm"
            >
              <span>Próxima</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="opacity-40 cursor-not-allowed flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
              <span>Próxima</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      )}

    </div>
  );
}
