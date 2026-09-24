'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { api, Article } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await api.getArticles({ q: query, per_page: 5 });
        setResults((response.data || []).filter((a: any) => !['hardware', 'tecnologia', 'esports'].includes(a.category?.slug)));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-28 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Search Palette Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-[#070b14] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 text-xs font-semibold text-slate-700 dark:text-cyan-400">
          <span>Pesquisar no NEXUS</span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-normal">ESC para fechar</span>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSubmit} className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3.5 bg-white dark:bg-transparent">
          <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua busca (ex: GTA VI, RTX 5090, PS5 Pro, Black Myth)..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          {loading && (
            <Loader2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin mr-3" />
          )}
          <button
            type="submit"
            className="hidden sm:flex items-center gap-1 text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg font-bold"
          >
            <span>Buscar</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>

        {/* Search Results / Suggestions */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {results.length > 0 ? (
            results.map((article) => (
              <Link
                key={article.id}
                href={`/${article.category?.slug}/${article.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-200 group"
              >
                <img
                  src={article.cover_image || '/images/placeholder-game.jpg'}
                  alt={article.title}
                  className="w-16 h-12 rounded-lg object-cover bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400">
                    {article.category?.name}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {article.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))
          ) : query.trim().length >= 2 && !loading ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Nenhuma matéria encontrada para &quot;{query}&quot;
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">
                Sugestões de busca:
              </span>
              <div className="flex flex-wrap gap-2">
                {['GTA VI', 'PlayStation', 'Xbox', 'Switch 2', 'Black Myth', 'Elden Ring'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/10 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 text-xs text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
