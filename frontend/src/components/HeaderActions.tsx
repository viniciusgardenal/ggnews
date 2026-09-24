'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import SearchModal from '@/components/SearchModal';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import { Category } from '@/lib/api';

interface HeaderActionsProps {
  categories: Category[];
}

export default function HeaderActions({ categories }: HeaderActionsProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut listener to toggle search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Trigger with Hotkey Badge */}
        <button
          onClick={() => setSearchOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/10 border border-slate-300/80 dark:border-slate-700/60 hover:border-cyan-500/50 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200"
          aria-label="Pesquisar notícias"
        >
          <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden xl:inline text-xs font-medium">Buscar...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setDrawerOpen(true)}
          type="button" 
          className="p-2 text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg lg:hidden transition-colors"
          aria-label="Abrir Menu de Navegação"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNavDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        categories={categories}
        onOpenSearch={() => setSearchOpen(true)} 
      />
    </>
  );
}
