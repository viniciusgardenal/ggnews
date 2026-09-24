'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { api, User } from '@/lib/api';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Terminal, 
  ShieldAlert, 
  Cpu 
} from 'lucide-react';

import ThemeToggle from '@/components/ThemeToggle';

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
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
      setLoading(false);
    } else {
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#05070e] text-cyan-600 dark:text-cyan-400 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 dark:border-t-cyan-400 animate-spin" />
            <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-xs uppercase tracking-widest text-cyan-600/80 dark:text-cyan-400/80">
            CARREGANDO PAINEL EDITORIAL...
          </span>
        </div>
      </div>
    );
  }

  // Render auth screens (login page) without top nav layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#05070e]">{children}</div>;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Artigos', path: '/admin/articles', icon: FileText },
    { name: 'Categorias', path: '/admin/categories', icon: FolderTree },
    { name: 'Configurações', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#05070e] text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
      
      {/* Admin Mission Control Top Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-cyan-500/20 bg-white/95 dark:bg-[#070b14]/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Left side: Brand Logo and Navigation links */}
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-950 border border-cyan-500/30 dark:border-cyan-400/50 shadow-sm">
                  <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase text-slate-900 dark:text-white font-mono tracking-widest">
                    NEXUS<span className="text-cyan-600 dark:text-cyan-400"> ADMIN</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">PAINEL EDITORIAL</span>
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center gap-1">
                {menuItems.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'bg-cyan-500 dark:bg-cyan-400 text-white dark:text-black shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-500/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side: Theme toggle, Public Portal shortcut & User Dossier / Logout */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all"
              >
                <span>VER SITE</span>
                <ExternalLink className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </Link>

              {user && (
                <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight font-mono">{user.name}</span>
                    <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">{user.role}</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs text-cyan-700 dark:text-cyan-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-mono font-bold transition-all"
                title="Sair da Conta"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SAIR</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Administrative Workspace */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

    </div>
  );
}
