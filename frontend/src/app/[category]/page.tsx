import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

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
      title: `${data.category.name} | Notícias de Games`,
      description: `Confira todas as últimas notícias, reviews e informações sobre ${data.category.name} no Core Loop News.`,
    };
  } catch (error) {
    return {
      title: 'Categoria | Core Loop News',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = Number(searchParams?.page || '1');
  let categoryData = null;

  try {
    categoryData = await api.getCategoryBySlug(params.category, currentPage);
  } catch (error) {
    console.error('Failed to load category articles:', error);
    notFound();
  }

  if (!categoryData) {
    notFound();
  }

  const { category, articles } = categoryData;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Category Header */}
      <header className="border-b border-[#1f2833]/40 pb-6 mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[#66fcf1] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">{category.name}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
          Categoria: <span className="text-[#66fcf1]">{category.name}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Explore todas as publicações e novidades sobre {category.name}.
        </p>
      </header>

      {/* Articles Feed */}
      {articles.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Simple Pagination Controls */}
          {articles.last_page > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 border-t border-[#1f2833]/20">
              {articles.prev_page_url ? (
                <Link
                  href={`/${category.slug}?page=${currentPage - 1}`}
                  className="rounded border border-[#1f2833] hover:border-[#66fcf1] hover:text-[#66fcf1] bg-[#0b0c10] px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all"
                >
                  Anterior
                </Link>
              ) : (
                <span className="opacity-50 cursor-not-allowed rounded border border-[#1f2833]/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Anterior
                </span>
              )}

              <span className="text-xs font-bold text-slate-400 tracking-wider">
                Página {articles.current_page} de {articles.last_page}
              </span>

              {articles.next_page_url ? (
                <Link
                  href={`/${category.slug}?page=${currentPage + 1}`}
                  className="rounded border border-[#1f2833] hover:border-[#66fcf1] hover:text-[#66fcf1] bg-[#0b0c10] px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all"
                >
                  Próxima
                </Link>
              ) : (
                <span className="opacity-50 cursor-not-allowed rounded border border-[#1f2833]/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Próxima
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-[#1f2833]/60 p-12 text-center text-slate-500">
          Nenhuma publicação encontrada nesta categoria no momento.
        </div>
      )}

    </div>
  );
}
