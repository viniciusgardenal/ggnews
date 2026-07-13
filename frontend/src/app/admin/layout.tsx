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
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c10] text-[#66fcf1]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1f2833] border-t-[#66fcf1]" />
          <span className="text-xs font-bold uppercase tracking-widest">Carregando Painel...</span>
        </div>
      </div>
    );
  }

  // Render auth screens (login page) without sidebar layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#07080a]">{children}</div>;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { name: 'Artigos', path: '/admin/articles', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { name: 'Categorias', path: '/admin/categories', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z' },
    { name: 'Configurações', path: '/admin/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z' },
  ];

  return (
    <div className="flex min-h-screen bg-[#07080a] text-slate-300">
      
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[#1f2833]/40 bg-[#0b0c10] flex flex-col justify-between">
        <div>
          {/* Header Branding */}
          <div className="h-20 flex items-center px-6 border-b border-[#1f2833]/30">
            <span className="text-lg font-black uppercase text-white tracking-widest">
              GG<span className="text-[#66fcf1]">ADMIN</span>
            </span>
          </div>

          {/* User profile widget */}
          {user && (
            <div className="p-6 border-b border-[#1f2833]/20 flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-[#1f2833] flex items-center justify-center border border-[#66fcf1]/50">
                <span className="text-xs font-bold text-[#66fcf1]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{user.role}</p>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-slate-900 border-l-2 border-[#66fcf1] text-[#66fcf1]'
                      : 'hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1f2833]/20 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Visualizar Site
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold text-rose-500 hover:bg-rose-950/20 hover:text-rose-400 transition-colors text-left"
          >
            <svg className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-[#1f2833]/30 px-8 flex items-center justify-between bg-[#0b0c10]/40">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {pathname.split('/').pop() || 'Painel'}
          </h2>
          <div className="flex items-center gap-4 text-xs font-bold text-[#66fcf1] bg-[#66fcf1]/5 px-3.5 py-1.5 rounded border border-[#66fcf1]/30">
            AMBIENTE SEGURO
          </div>
        </header>
        <div className="p-8 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
