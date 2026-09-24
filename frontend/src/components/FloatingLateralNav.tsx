'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Gamepad2, 
  Cpu, 
  Layers, 
  Sparkles, 
  Search, 
  Terminal, 
  Sun, 
  Moon, 
  ArrowUp,
  ChevronRight,
  Compass,
  Laptop
} from 'lucide-react';
import { Category } from '@/lib/api';
import SearchModal from '@/components/SearchModal';

interface FloatingLateralNavProps {
  categories?: Category[];
}

export default function FloatingLateralNav({ categories = [] }: FloatingLateralNavProps) {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('nexus_theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Listen to scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Ctrl+K / Cmd+K listener
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

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('nexus_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clean Default Categories
  const navCategories = categories && categories.length > 0 
    ? categories.filter(c => !['hardware', 'tecnologia', 'esports'].includes(c.slug))
    : [
        { id: 1, name: 'Games', slug: 'games' },
        { id: 2, name: 'PlayStation', slug: 'playstation' },
        { id: 3, name: 'Xbox', slug: 'xbox' },
        { id: 4, name: 'Nintendo', slug: 'nintendo' },
        { id: 5, name: 'Reviews', slug: 'reviews' },
      ];

  // Helper icons and clean descriptions
  const getCategoryMeta = (slug: string) => {
    switch (slug?.toLowerCase()) {
      case 'games':
      case 'cyberspace':
        return {
          icon: Gamepad2,
          tag: 'Lançamentos, novidades e notícias de jogos',
          telemetry: 'Universo Gamer',
          accent: 'text-cyan-600 dark:text-cyan-400',
          border: 'border-cyan-500/50',
          bg: 'hover:bg-cyan-500/10',
          glow: 'shadow-[0_0_15px_rgba(2,132,199,0.2)] dark:shadow-[0_0_15px_rgba(0,240,255,0.3)]',
        };
      case 'playstation':
        return {
          icon: Gamepad2,
          tag: 'Jogos de PS5, PS4 e novidades da Sony',
          telemetry: 'PlayStation',
          accent: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-500/50',
          bg: 'hover:bg-blue-500/10',
          glow: 'shadow-[0_0_15px_rgba(37,99,235,0.2)]',
        };
      case 'xbox':
        return {
          icon: Layers,
          tag: 'Jogos Xbox Series X/S e Xbox Game Pass',
          telemetry: 'Xbox & PC',
          accent: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-500/50',
          bg: 'hover:bg-emerald-500/10',
          glow: 'shadow-[0_0_15px_rgba(5,150,105,0.2)] dark:shadow-[0_0_15px_rgba(0,255,163,0.3)]',
        };
      case 'nintendo':
        return {
          icon: Sparkles,
          tag: 'Jogos de Switch, Mario, Zelda e exclusivos',
          telemetry: 'Nintendo',
          accent: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-500/50',
          bg: 'hover:bg-rose-500/10',
          glow: 'shadow-[0_0_15px_rgba(225,29,72,0.2)]',
        };
      case 'pc-gaming':
        return {
          icon: Laptop,
          tag: 'Jogos para PC, Steam, mods e lançamentos',
          telemetry: 'PC Gaming',
          accent: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-500/50',
          bg: 'hover:bg-amber-500/10',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
        };
      case 'reviews':
      default:
        return {
          icon: Sparkles,
          tag: 'Análises completas com notas e vereditos',
          telemetry: 'Reviews',
          accent: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-500/50',
          bg: 'hover:bg-purple-500/10',
          glow: 'shadow-[0_0_15px_rgba(124,58,237,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        };
    }
  };

  return (
    <>
      {/* ====================================================================
          FLOATING LATERAL MENU (DESKTOP & TABLET: LEFT VIEWPORT)
          ==================================================================== */}
      <aside 
        className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center select-none"
        aria-label="Menu Lateral de Navegação"
      >
        {/* Floating Capsule */}
        <div className="relative flex flex-col items-center gap-1.5 p-2 rounded-2xl floating-glass border border-slate-300/80 dark:border-cyan-500/30 shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-2xl">
          
          {/* Brand Home Icon */}
          <Link 
            href="/"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/80 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:scale-105 transition-all group"
            title="NEXUS - Página Inicial"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-500/20 group-hover:rotate-180 transition-transform duration-500" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" className="fill-cyan-500" />
            </svg>
          </Link>

          {/* Separator */}
          <div className="w-6 h-[1px] bg-slate-300 dark:bg-cyan-500/30 my-1" />

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-1.5">
            
            {/* Home Option */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Link
                href="/"
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border ${
                  pathname === '/'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-300 shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/30'
                }`}
                aria-label="Página Inicial"
              >
                <Compass className="w-4 h-4" />
                {pathname === '/' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-500 dark:bg-cyan-400 rounded-r-full" />
                )}
              </Link>

              {/* Hover Expansion Card */}
              {hoveredIdx === 0 && (
                <div className="absolute left-full pl-3 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                  <Link
                    href="/"
                    className="block relative w-60 p-3.5 rounded-2xl bg-white/95 dark:bg-[#070b16]/95 border border-slate-300/80 dark:border-cyan-500/40 shadow-xl backdrop-blur-2xl group/card cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 text-[10px] font-semibold">
                      <span className="text-cyan-600 dark:text-cyan-400">PÁGINA INICIAL</span>
                      <span className="text-emerald-600 dark:text-emerald-400">FEED PRINCIPAL</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-300 transition-colors">
                      Início
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal mt-1">
                      Todas as principais notícias, matérias em destaque e lançamentos recentes.
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                      <span>Acessar</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Dynamic Categories */}
            {navCategories.map((category, idx) => {
              const itemIdx = idx + 1;
              const meta = getCategoryMeta(category.slug);
              const Icon = meta.icon;
              const isActive = pathname.startsWith(`/${category.slug}`);

              return (
                <div
                  key={category.id || idx}
                  className="relative"
                  onMouseEnter={() => setHoveredIdx(itemIdx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <Link
                    href={`/${category.slug}`}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border ${
                      isActive
                        ? `bg-cyan-500/15 ${meta.border} ${meta.accent} ${meta.glow}`
                        : `border-transparent text-slate-600 dark:text-slate-400 hover:${meta.accent} ${meta.bg} hover:${meta.border}`
                    }`}
                    aria-label={category.name}
                  >
                    <Icon className="w-4 h-4" />
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-500 dark:bg-cyan-400 rounded-r-full" />
                    )}
                  </Link>

                  {/* Hover Expansion Card */}
                  {hoveredIdx === itemIdx && (
                    <div className="absolute left-full pl-3 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                      <Link
                        href={`/${category.slug}`}
                        className="block relative w-60 p-3.5 rounded-2xl bg-white/95 dark:bg-[#070b16]/95 border border-slate-300/80 dark:border-cyan-500/40 shadow-xl backdrop-blur-2xl group/card cursor-pointer hover:border-cyan-400 transition-colors"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 text-[10px] font-semibold">
                          <span className={meta.accent}>CATEGORIA</span>
                          <span className="text-slate-500 dark:text-slate-400">{meta.telemetry}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-300 transition-colors">
                          {category.name}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal mt-1">
                          {meta.tag}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                          <span>Ver matérias</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

          </nav>

          {/* Separator */}
          <div className="w-6 h-[1px] bg-slate-300 dark:bg-cyan-500/30 my-1" />

          {/* Tools */}
          <div className="flex flex-col items-center gap-1.5">
            
            {/* Search */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredIdx(90)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <button
                onClick={() => setSearchOpen(true)}
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-transparent hover:border-cyan-500/30 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                aria-label="Buscar matérias (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {hoveredIdx === 90 && (
                <div className="absolute left-full pl-3 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                  <button
                    onClick={() => setSearchOpen(true)}
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#070b16]/95 border border-slate-300 dark:border-cyan-500/40 shadow-lg text-xs whitespace-nowrap text-slate-800 dark:text-slate-200 flex items-center gap-2 hover:border-cyan-400 transition-colors"
                  >
                    <span>Buscar</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-black/50 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono">⌘K</kbd>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredIdx(91)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <button
                onClick={toggleTheme}
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-transparent hover:border-cyan-500/30 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 transition-all group"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-cyan-600 transition-transform group-hover:-rotate-12" />
                )}
              </button>

              {hoveredIdx === 91 && (
                <div className="absolute left-full pl-3 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                  <button
                    onClick={toggleTheme}
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#070b16]/95 border border-slate-300 dark:border-cyan-500/40 shadow-lg text-xs whitespace-nowrap text-slate-800 dark:text-slate-200 hover:border-cyan-400 transition-colors"
                  >
                    {theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
                  </button>
                </div>
              )}
            </div>


            {/* Scroll to Top */}
            {scrollY > 300 && (
              <button
                onClick={scrollToTop}
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black shadow-md transition-all animate-in zoom-in-75 duration-200 mt-1"
                title="Voltar ao topo"
              >
                <ArrowUp className="w-4 h-4 text-black" />
              </button>
            )}

          </div>

        </div>
      </aside>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
