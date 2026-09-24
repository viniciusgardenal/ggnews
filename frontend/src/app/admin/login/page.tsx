'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import { Terminal, Lock, Mail, ShieldAlert, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Pre-fill default testing credentials
  const [email, setEmail] = useState('admin@nexuswire.gg');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.admin.login({ email, password });
      
      // Store auth session
      localStorage.setItem('gg_admin_token', response.token);
      localStorage.setItem('gg_admin_user', JSON.stringify(response.user));
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciais não autorizadas. Verifique sua chave de acesso.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@nexuswire.gg');
    setPassword('password123');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#05070e] text-slate-800 dark:text-slate-200 px-4 relative overflow-hidden transition-colors">
      
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-white/95 dark:bg-[#070b14]/95 p-8 shadow-xl dark:shadow-[0_0_50px_rgba(0,240,255,0.15)] relative z-10 backdrop-blur-xl transition-all">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-400/50 shadow-sm mb-4">
            <Terminal className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold uppercase text-slate-900 dark:text-white tracking-wider">
            NEXUS <span className="text-cyan-600 dark:text-cyan-400">ADMIN</span>
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Painel de Controle e Gestão de Conteúdo
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mb-6 rounded-xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50/80 dark:bg-cyan-950/20 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Credenciais de teste disponíveis</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-bold uppercase text-[10px] tracking-wider transition-all shadow-sm"
          >
            Preencher
          </button>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/50 p-4 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-all"
                placeholder="admin@nexus.com.br"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md dark:shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-4">
          <span className="text-[11px] text-slate-500">
            Acesso Restrito • NEXUS Admin
          </span>
        </div>

      </div>
    </div>
  );
}
