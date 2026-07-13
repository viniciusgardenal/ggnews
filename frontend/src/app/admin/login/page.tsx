'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Pre-fill default testing credentials
  const [email, setEmail] = useState('admin@ggnews.com');
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
      setError(err.message || 'Credenciais inválidas. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@ggnews.com');
    setPassword('password123');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07080a] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1f2833]/60 bg-[#0b0c10] p-8 shadow-2xl neon-border">
        
        {/* Header branding */}
        <div className="text-center mb-6">
          <span className="text-3xl font-black tracking-widest uppercase text-white">
            GG<span className="text-[#66fcf1]">ADMIN</span>
          </span>
          <p className="mt-2 text-xs text-slate-500 uppercase tracking-widest">Acesso restrito a autores</p>
        </div>

        {/* Demo Credentials Info Banner */}
        <div className="mb-6 rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-center text-xs text-slate-400">
          <p className="font-bold text-amber-500 mb-1">Acesso de Teste Facilitado</p>
          <p className="text-[10px]">As credenciais foram pré-carregadas abaixo para agilidade.</p>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 rounded-lg bg-rose-950/30 border border-rose-900/50 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-[#1f2833] bg-[#0b0c10] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#66fcf1] focus:outline-none focus:ring-1 focus:ring-[#66fcf1] transition-all"
              placeholder="seuemail@ggnews.com"
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-[#1f2833] bg-[#0b0c10] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#66fcf1] focus:outline-none focus:ring-1 focus:ring-[#66fcf1] transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(102,252,241,0.2)]"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Autenticando...
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
