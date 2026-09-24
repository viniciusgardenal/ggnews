'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('gg_admin_token');
    
    if (token) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#05070e] text-cyan-600 dark:text-cyan-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-800 border-t-cyan-500 dark:border-t-cyan-400" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Carregando Sessão...</span>
      </div>
    </div>
  );
}
