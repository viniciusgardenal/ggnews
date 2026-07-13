'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Article, Category } from '@/lib/api';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = () => {
    setLoading(true);
    api.admin.getArticles({
      page,
      q: search || undefined,
      category_id: categoryFilter || undefined,
      status: statusFilter || undefined
    })
      .then((res) => {
        setArticles(res.data);
        setLastPage(res.last_page);
      })
      .catch((err) => setError(err.message || 'Erro ao buscar notícias.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch categories on mount
    api.admin.getCategories()
      .then((res) => setCategories(res))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [page, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Deseja realmente excluir a notícia "${title}"?`)) {
      return;
    }

    try {
      await api.admin.deleteArticle(id);
      fetchArticles();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir artigo.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase text-white tracking-wider">Gerenciador de Artigos</h1>
          <p className="text-xs text-slate-500 mt-1">Crie, edite e publique as notícias do seu site público.</p>
        </div>
        <Link
          href="/admin/articles/create"
          className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(102,252,241,0.15)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar Notícia
        </Link>
      </div>

      {/* Filters bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-[#1f2833]/30 bg-[#0b0c10]/40 rounded-xl">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            placeholder="Pesquisar por título ou resumo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-[#66fcf1] focus:outline-none focus:ring-1 focus:ring-[#66fcf1]"
          />
          <button type="submit" className="absolute right-3 top-3 text-slate-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
            </svg>
          </button>
        </div>

        {/* Category */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-2.5 text-xs text-slate-400 focus:border-[#66fcf1] focus:outline-none focus:ring-1 focus:ring-[#66fcf1]"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-2.5 text-xs text-slate-400 focus:border-[#66fcf1] focus:outline-none focus:ring-1 focus:ring-[#66fcf1]"
          >
            <option value="">Todos os Status</option>
            <option value="published">Publicado</option>
            <option value="draft">Rascunho</option>
          </select>
        </div>
      </form>

      {/* Grid listing */}
      <div className="rounded-xl border border-[#1f2833]/40 bg-[#0b0c10] overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-500 text-sm font-bold tracking-widest uppercase">
            Carregando artigos...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-400 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#1f2833]/20 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Matéria</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Autor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2833]/20">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={article.cover_image || '/images/placeholder-game.jpg'}
                          alt={article.title}
                          className="h-10 w-16 object-cover rounded bg-[#1f2833]"
                        />
                        <div>
                          <p className="font-bold text-white max-w-sm truncate">{article.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-sm">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{article.category.name}</td>
                      <td className="px-6 py-4 text-slate-400">{article.author.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                            article.status === 'published'
                              ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50'
                              : 'bg-amber-950/30 text-amber-400 border border-amber-900/50'
                          }`}
                        >
                          {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          className="text-xs font-bold text-[#66fcf1] hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="text-xs font-bold text-rose-500 hover:underline"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Nenhum artigo encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {lastPage > 1 && (
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-500">
            Página {page} de {lastPage}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#1f2833] hover:border-[#66fcf1] hover:text-[#66fcf1] transition-all disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#1f2833] hover:border-[#66fcf1] hover:text-[#66fcf1] transition-all disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
