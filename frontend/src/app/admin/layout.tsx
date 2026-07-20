'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { api, User } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Paths that do not require authentication
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const token = localStorage.getItem('gg_admin_token');
    const savedUser = localStorage.getItem('gg_admin_user');

    if (!token) {
      if (!isLoginPage) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      // Validate session with API
      api.admin.getMe()
        .then((fetchedUser) => {
          setUser(fetchedUser);
          localStorage.setItem('gg_admin_user', JSON.stringify(fetchedUser));
          if (isLoginPage) {
            router.push('/admin/dashboard');
          }
        })
        .catch(() => {
          localStorage.removeItem('gg_admin_token');
          localStorage.removeItem('gg_admin_user');
          if (!isLoginPage) router.push('/admin/login');
        })
        .finally(() => setLoading(false));
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await api.admin.logout();
    } catch (e) {
      console.error('Logout error: ', e);
    } finally {
      localStorage.removeItem('gg_admin_token');
      localStorage.removeItem('gg_admin_user');
      setUser(null);
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#0b0c10] text-[#66fcf1]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 dark:border-[#1f2833] border-t-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-400">Carregando Painel...</span>
        </div>
      </div>
    );
  }

  // Render auth screens (login page) without top nav layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-[#07080a]">{children}</div>;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Artigos', path: '/admin/articles' },
    { name: 'Categorias', path: '/admin/categories' },
    { name: 'Configurações', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-[#07080a] text-zinc-850 dark:text-[#c5c6c7] transition-colors duration-300">
      
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#0b0c10]/95 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Left side: Brand Logo and Navigation links */}
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                <span className="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-widest">
                  CLN<span className="text-[#66fcf1]">ADMIN</span>
                </span>
              </Link>

              {/* Navigation links */}
              <nav className="hidden md:flex items-center gap-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        isActive
                           ? 'bg-[#66fcf1]/10 text-[#66fcf1]'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side: User widget & Actions */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-zinc-200 dark:border-zinc-800">
                  <div className="h-7 w-7 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-[#66fcf1]/30">
                    <span className="text-xs font-bold text-zinc-700 dark:text-[#66fcf1]">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-zinc-700 dark:text-white truncate max-w-[120px]">{user.name}</p>
                  </div>
                </div>
              )}

              <Link
                href="/"
                target="_blank"
                className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Ver Site
              </Link>
              
              <button
                onClick={handleLogout}
                type="button"
                className="text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors"
              >
                Sair
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile navigation header bar */}
      <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0b0c10]/70 py-2.5 px-4 overflow-x-auto whitespace-nowrap flex gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-150 inline-block ${
                isActive
                  ? 'bg-[#66fcf1]/10 text-[#66fcf1]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Admin Content Area */}
      <main className="flex-grow container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Simple footer for info */}
      <footer className="py-4 border-t border-zinc-200 dark:border-zinc-800/50 bg-white/50 dark:bg-[#0b0c10]/20 text-center text-[10px] text-zinc-400 uppercase tracking-widest">
        CORE LOOP NEWS ADMIN • Ambiente Seguro
      </footer>
      
    </div>
  );
}
