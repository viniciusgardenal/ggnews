import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { Search, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

interface SearchPageProps {
  searchParams?: {
    q?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || '';
  return {
    title: query ? `Busca: "${query}" | NEXUS` : 'Pesquisa de Notícias | NEXUS',
    description: `Resultados de pesquisa no portal NEXUS.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page || '1');
  let searchResults = null;

  if (query.trim()) {
    try {
      searchResults = await api.getArticles({ q: query, page: currentPage, per_page: 9 });
      if (searchResults) {
        searchResults.data = (searchResults.data || []).filter((a: any) => !['hardware', 'tecnologia', 'esports'].includes(a.category?.slug));
      }
    } catch (error) {
      console.error('Failed to execute search query:', error);
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 font-sans">
      
      {/* Header section */}
      <header className="p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium">Busca</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider mb-2 shadow-sm">
                <Search className="w-3.5 h-3.5" />
                <span>Resultados da Pesquisa</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Busca por: <span className="text-cyan-600 dark:text-cyan-400">&quot;{query}&quot;</span>
              </h1>
            </div>

            {searchResults && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-slate-800 text-xs text-right shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Total de Resultados</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-base">
                  {searchResults.total} {searchResults.total === 1 ? 'matéria' : 'matérias'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Results Feed */}
      {searchResults && searchResults.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {searchResults.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {searchResults.last_page > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
              {searchResults.prev_page_url ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </Link>
              ) : (
                <span className="opacity-40 cursor-not-allowed flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </span>
              )}

              <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-black/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 shadow-sm font-semibold">
                Página <span className="text-cyan-600 dark:text-cyan-400 font-bold">{searchResults.current_page}</span> de {searchResults.last_page}
              </span>

              {searchResults.next_page_url ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm"
                >
                  <span>Próxima</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="opacity-40 cursor-not-allowed flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400">
                  <span>Próxima</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          )}
        </>
      ) : query.trim() ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base text-slate-600 dark:text-slate-400">
            Nenhuma matéria encontrada com o termo &quot;{query}&quot;.
          </p>
          <p className="text-xs text-slate-400">Tente buscar por termos mais gerais como GTA VI, RTX 5090 ou PS5 Pro.</p>
        </div>
      ) : null}

    </div>
  );
}
