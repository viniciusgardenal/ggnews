'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, DashboardResponse } from '@/lib/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getDashboardStats()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'Erro ao carregar estatísticas.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 text-sm font-bold uppercase tracking-widest">
        Carregando métricas...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg bg-rose-950/20 border border-rose-900/50 p-6 text-sm text-rose-400">
        {error || 'Não foi possível carregar os dados.'}
      </div>
    );
  }

  const { stats, recent_articles } = data;

  const statCards = [
    { name: 'Total de Artigos', value: stats.total_articles, color: 'border-slate-800' },
    { name: 'Artigos Publicados', value: stats.published_articles, color: 'border-emerald-900/60 text-emerald-400' },
    { name: 'Rascunhos', value: stats.draft_articles, color: 'border-amber-900/60 text-amber-400' },
    { name: 'Categorias Criadas', value: stats.total_categories, color: 'border-rose-950/60 text-rose-400' },
  ];

  return (
    <div className="space-y-10">
      
      {/* 1. Stat cards grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-xl border bg-[#0b0c10] p-6 shadow-md flex flex-col justify-between h-32 ${card.color}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.name}</span>
            <span className="text-3xl font-black">{card.value}</span>
          </div>
        ))}
      </section>

      {/* 2. Recent Articles Section */}
      <section className="rounded-xl border border-[#1f2833]/40 bg-[#0b0c10] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1f2833]/30 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Artigos Publicados Recentemente</h3>
          <Link
            href="/admin/articles/create"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded transition-all shadow-[0_0_15px_rgba(102,252,241,0.15)]"
          >
            Nova Matéria
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1f2833]/20 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Artigo</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Criado em</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2833]/20">
              {recent_articles.length > 0 ? (
                recent_articles.map((article) => {
                  const createdDate = new Date(article.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  return (
                    <tr key={article.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={article.cover_image || '/images/placeholder-game.jpg'}
                          alt={article.title}
                          className="h-10 w-16 object-cover rounded bg-[#1f2833]"
                        />
                        <span className="font-bold text-white max-w-xs truncate">{article.title}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{article.category.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                            article.status === 'published'
                              ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/55'
                              : 'bg-amber-950/30 text-amber-400 border border-amber-900/55'
                          }`}
                        >
                          {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{createdDate}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          className="text-xs font-bold text-[#66fcf1] hover:underline"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Nenhum artigo criado ainda.
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
