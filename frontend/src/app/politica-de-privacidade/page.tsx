import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade | NEXUS',
  description: 'Política de Privacidade e proteção de dados do portal NEXUS.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Header */}
      <header className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] space-y-4 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Política de Privacidade</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacidade & Dados</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
          Política de Privacidade
        </h1>

        <p className="text-xs text-slate-500">Última atualização: Setembro de 2026</p>
      </header>

      {/* Content */}
      <section className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] shadow-sm">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">01.</span> Coleta de Dados e Navegação
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            O NEXUS preza pela privacidade dos seus leitores. Não vendemos nem compartilhamos seus dados pessoais com terceiros. As métricas de acesso aos artigos são contabilizadas de forma anônima e agregada para entendermos quais assuntos mais interessam à nossa comunidade.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">02.</span> Armazenamento de Preferências (Cookies e LocalStorage)
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Utilizamos armazenamento local no seu navegador exclusivamente para memorizar sua preferência de tema (Modo Claro ou Modo Escuro) e manter a sessão ativa caso você acesse a área administrativa.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">03.</span> Direitos do Usuário e Contato
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Você tem total direito de solicitar esclarecimentos sobre o tratamento dos seus dados. Para qualquer dúvida ou solicitação, entre em contato através da nossa página de <Link href="/contato" className="text-cyan-600 dark:text-cyan-400 underline font-semibold">Contato</Link>.
          </p>
        </div>
      </section>

    </div>
  );
}
