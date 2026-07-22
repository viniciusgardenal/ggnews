'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-[#0b0c10] border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <span className="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-widest">
              CORE<span className="text-[#66fcf1]">LOOP</span>
            </span>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              aria-label="Fechar Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hover:border-[#66fcf1]"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Pesquisar...
            </span>
            <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">Buscar</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">Categorias</span>
            <Link
              href="/"
              onClick={onClose}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Tema</span>
            <ThemeToggle />
          </div>

          <Link
            href="/admin"
            onClick={onClose}
            className="w-full py-3 text-center block text-xs font-bold uppercase tracking-wider text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded-xl shadow-md"
          >
            Painel Admin
          </Link>
        </div>

      </div>
    </div>
  );
}
