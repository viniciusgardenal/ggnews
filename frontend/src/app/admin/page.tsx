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
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c10] text-[#66fcf1]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1f2833] border-t-[#66fcf1]" />
        <span className="text-xs font-bold uppercase tracking-widest">Carregando Sessão...</span>
      </div>
    </div>
  );
}
