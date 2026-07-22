import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

interface SearchPageProps {
  searchParams?: {
    q?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || '';
  return {
    title: query ? `Resultados para "${query}" | Core Loop News` : 'Pesquisa | Core Loop News',
    description: `Busca de notícias e reviews de games no Core Loop News.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page || '1');
  let searchResults = null;

  if (query.trim()) {
    try {
      searchResults = await api.getArticles({ q: query, page: currentPage, per_page: 9 });
    } catch (error) {
      console.error('Failed to execute search query:', error);
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header section */}
      <header className="border-b border-[#1f2833]/40 pb-6 mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[#66fcf1] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Pesquisa</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
          Resultados de Pesquisa: <span className="text-[#66fcf1]">&quot;{query}&quot;</span>
        </h1>
        
        {searchResults && (
          <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">
            {searchResults.total} {searchResults.total === 1 ? 'matéria encontrada' : 'matérias encontradas'}
          </p>
        )}
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
            <div className="flex justify-center items-center gap-4 pt-6 border-t border-[#1f2833]/20">
              {searchResults.prev_page_url ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
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
                Página {searchResults.current_page} de {searchResults.last_page}
              </span>

              {searchResults.next_page_url ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
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
        <div className="rounded-xl border border-dashed border-[#1f2833]/60 p-12 text-center text-slate-500 space-y-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Nenhuma matéria encontrada para "${query}".` : 'Digite um termo no campo de busca para pesquisar.'}
          </p>
          <p className="text-xs text-slate-500">
            Tente buscar por nomes de jogos como &quot;GTA&quot;, &quot;Assassin&apos;s Creed&quot; ou palavras-chave das notícias.
          </p>
        </div>
      )}

    </div>
  );
}
