'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('nexus_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    
    setTheme(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-slate-700/60" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-slate-700/60 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all duration-200 group"
      aria-label="Alternar tema claro ou escuro"
      title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-600 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
