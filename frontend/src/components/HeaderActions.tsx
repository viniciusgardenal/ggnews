'use client';

import { useState } from 'react';
import Link from 'next/link';
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

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Search Trigger Button */}
        <button
          onClick={() => setSearchOpen(true)}
          type="button"
          className="p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Abrir Pesquisa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <ThemeToggle />

        <Link
          href="/admin"
          className="relative hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded transition-all duration-200 shadow-[0_0_15px_rgba(102,252,241,0.2)] hover:shadow-[0_0_25px_rgba(102,252,241,0.4)]"
        >
          Admin Panel
        </Link>
        
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setDrawerOpen(true)}
          type="button" 
          className="p-2 text-slate-400 hover:text-white md:hidden"
          aria-label="Abrir Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
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
