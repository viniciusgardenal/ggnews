'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Search, ChevronRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Category } from '@/lib/api';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onOpenSearch: () => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  categories,
  onOpenSearch,
}: MobileNavDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validCategories = (categories || []).filter(c => !['hardware', 'tecnologia', 'esports'].includes(c.slug));

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-[#070b14] border-l border-slate-200 dark:border-cyan-500/20 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                N
              </div>
              <span className="text-lg font-black uppercase text-slate-900 dark:text-white tracking-wider font-mono">
                NEXUS
              </span>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Fechar Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-black/40 text-xs text-slate-700 dark:text-slate-300 hover:border-cyan-500 transition-all"
          >
            <span className="flex items-center gap-2 font-medium">
              <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Buscar matérias...
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-black/60 px-2 py-0.5 rounded font-mono font-bold">⌘K</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 px-3 font-semibold">
              Categorias
            </span>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            >
              <span>Início</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            {validCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
              >
                <span>{cat.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Alternar Tema:</span>
            <ThemeToggle />
          </div>
        </div>

      </div>
    </div>
  );
}
