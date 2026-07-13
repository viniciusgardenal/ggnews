'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check local storage or default to light mode
    const savedTheme = localStorage.getItem('gg_theme') as 'light' | 'dark' | null;
    const defaultTheme = savedTheme || 'light';
    
    setTheme(defaultTheme);
    
    if (defaultTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('gg_theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 border border-[#1f2833]/60 hover:border-[#66fcf1] rounded-full bg-[#0b0c10]/20 text-slate-400 hover:text-white transition-all duration-200"
      aria-label="Alternar Tema"
    >
      {theme === 'light' ? (
        // Moon Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        // Sun Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.95 4.95l1.586 1.586m11.14 11.14l1.586 1.586M3 12h2.25m13.5 0H21m-16.05 6.05l1.586-1.586m11.14-11.14l1.586-1.586M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
        </svg>
      )}
    </button>
  );
}
