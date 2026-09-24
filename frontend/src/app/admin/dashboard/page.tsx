'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, DashboardResponse } from '@/lib/api';
import { 
  FileText, 
  FolderTree, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Terminal, 
  Cpu, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getDashboardStats()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'Erro ao carregar dados do painel.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-cyan-400 text-xs uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <span>Carregando dados do painel...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl bg-rose-950/20 border border-rose-500/40 p-6 text-xs text-rose-300">
        {error || 'Não foi possível carregar os dados.'}
      </div>
    );
  }

  const { stats, recent_articles } = data;

  const statCards = [
    { 
      name: 'Total de Artigos', 
      value: stats.total_articles, 
      icon: FileText,
      tag: 'Geral',
      color: 'text-cyan-400 border-cyan-500/30' 
    },
    { 
      name: 'Artigos Publicados', 
      value: stats.published_articles, 
      icon: CheckCircle2,
      tag: 'Ativos',
      color: 'text-emerald-400 border-emerald-500/30' 
    },
    { 
      name: 'Rascunhos', 
      value: stats.draft_articles, 
      icon: Clock,
      tag: 'Em edição',
      color: 'text-amber-400 border-amber-500/30' 
    },
    { 
      name: 'Categorias', 
      value: stats.total_categories, 
      icon: FolderTree,
      tag: 'Ativas',
      color: 'text-purple-400 border-purple-500/30' 
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider block mb-1">
            Visão Geral
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
            Painel de Controle
          </h1>
        </div>

        <Link
          href="/admin/articles/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-white dark:text-black" />
          <span>Novo Artigo</span>
        </Link>
      </div>

      {/* 2. Stat Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]/90 p-6 flex flex-col justify-between h-32 shadow-sm relative overflow-hidden group hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.name}
                </span>
                <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {card.value}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {card.tag}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Recent Articles Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]/90 overflow-hidden shadow-sm">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Artigos Recentes
          </h3>
          <Link
            href="/admin/articles"
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors font-medium"
          >
            <span>Ver todos os artigos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <th className="px-6 py-3.5">Título</th>
                <th className="px-6 py-3.5">Categoria</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {recent_articles.length > 0 ? (
                recent_articles.map((article) => {
                  const createdDate = new Date(article.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  const isPublished = article.status === 'published';

                  return (
                    <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-cyan-500/5 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={article.cover_image || '/images/placeholder-game.jpg'}
                          alt={article.title}
                          className="h-9 w-14 object-cover rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white max-w-sm truncate">{article.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-700 text-cyan-700 dark:text-cyan-300 text-[11px]">
                          {article.category?.name || 'Geral'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPublished
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'}`} />
                          {isPublished ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {createdDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${article.category?.slug}/${article.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-500/10 transition-colors"
                            title="Visualizar no Portal"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/articles/edit/${article.id}`}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-500/10 transition-colors"
                            title="Editar Artigo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Nenhum artigo cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
}
