'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
        setResults(response.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Bar Input */}
        <form onSubmit={handleSubmit} className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-zinc-400 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar notícias, reviews ou lançamentos..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mr-2" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-700 dark:hover:text-white px-2 py-1"
          >
            ESC
          </button>
        </form>

        {/* Live Suggestions Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {query.trim().length >= 2 && results.length === 0 && !loading && (
            <div className="text-center py-8 text-xs text-zinc-500 uppercase tracking-wider">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          )}

          {results.map((article) => (
            <Link
              key={article.id}
              href={`/${article.category.slug}/${article.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors group"
            >
              {article.cover_image && (
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="overflow-hidden flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 block mb-0.5">
                  {article.category.name}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-[var(--accent)] transition-colors">
                  {article.title}
                </h4>
              </div>
            </Link>
          ))}

          {results.length > 0 && (
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/60 text-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#ff8838] hover:underline"
              >
                Ver todos os resultados para &quot;{query}&quot; →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
