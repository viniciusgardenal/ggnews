'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Article, Category } from '@/lib/api';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';

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
      .catch((err) => setError(err.message || 'Erro ao sincronizar artigos com o servidor.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
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
    if (!confirm(`Deseja realmente excluir o artigo "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await api.admin.deleteArticle(id);
      fetchArticles();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir artigo do sistema.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>GERENCIAMENTO DE CONTEÚDO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white font-mono tracking-tight">
            Gerenciador de Artigos
          </h1>
        </div>

        <Link
          href="/admin/articles/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md dark:shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4 text-white dark:text-black" />
          <span>NOVO ARTIGO</span>
        </Link>
      </div>

      {/* Cyber Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-slate-200 dark:border-cyan-500/20 bg-white/95 dark:bg-[#070b14]/90 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-md">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            placeholder="Buscar por título, resumo ou palavra-chave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 pl-10 pr-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-3.5 py-2.5 text-xs font-mono text-slate-800 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          >
            <option value="">TODAS AS CATEGORIAS</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-3.5 py-2.5 text-xs font-mono text-slate-800 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          >
            <option value="">TODOS OS STATUS</option>
            <option value="published">PUBLICADOS</option>
            <option value="draft">RASCUNHOS</option>
          </select>
        </div>
      </form>

      {/* Cyber Grid listing */}
      <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-md">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 dark:border-t-cyan-400 animate-spin" />
              <span>CARREGANDO ARTIGOS...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-xs font-mono text-rose-500 dark:text-rose-400 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Artigo</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Autor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {articles.length > 0 ? (
                  articles.map((article) => {
                    const isPublished = article.status === 'published';
                    return (
                      <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-cyan-500/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={article.cover_image || '/images/placeholder-game.jpg'}
                            alt={article.title}
                            className="h-10 w-16 object-cover rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-800 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white max-w-sm truncate text-sm">{article.title}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">{article.excerpt}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-700 text-cyan-700 dark:text-cyan-300 text-[10px] font-medium">
                            {article.category?.name || 'Geral'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{article.author?.name}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isPublished
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'}`} />
                            {isPublished ? 'PUBLICADO' : 'RASCUNHO'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/${article.category?.slug}/${article.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-500/10 transition-colors"
                              title="Visualizar Artigo"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/articles/edit/${article.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-500/10 transition-colors"
                              title="Editar Artigo"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              title="Excluir Artigo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono">
                      NENHUM ARTIGO ENCONTRADO COM OS FILTROS APLICADOS.
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
        <div className="flex justify-between items-center pt-2 font-mono text-xs">
          <span className="text-slate-500">
            PÁGINA <span className="text-cyan-600 dark:text-cyan-400 font-bold">{page}</span> DE {lastPage}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 disabled:opacity-40 disabled:hover:border-slate-300 dark:disabled:hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ANTERIOR</span>
            </button>
            <button
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 disabled:opacity-40 disabled:hover:border-slate-300 dark:disabled:hover:border-slate-700 transition-all"
            >
              <span>PRÓXIMA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
