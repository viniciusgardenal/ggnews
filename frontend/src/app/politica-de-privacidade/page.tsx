import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Core Loop News',
  description: 'Política de Privacidade e proteção de dados do portal Core Loop News.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Política de Privacidade</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white tracking-wider">
          Política de <span className="text-[#ea580c] dark:text-[#ff8838]">Privacidade</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-2">Última atualização: Julho de 2026</p>
      </header>

      <section className="space-y-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">1. Coleta de Informações</h2>
          <p>
            O Core Loop News valoriza sua privacidade. Coletamos informações de navegação anonimizadas apenas para fins analíticos de audiência e melhoria contínua da experiência do usuário.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">2. Cookies de Navegação</h2>
          <p>
            Utilizamos cookies estritamente necessários para armazenar suas preferências de tema (modo claro/escuro) e melhorar o tempo de resposta das páginas.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">3. Contato e Suporte</h2>
          <p>
            Quaisquer dúvidas sobre a gestão de dados pessoais podem ser enviadas diretamente para <strong>contato@coreloopnews.com</strong>.
          </p>
        </div>
      </section>

    </div>
  );
}
