import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | Core Loop News',
  description: 'Termos e Condições de Uso do portal Core Loop News.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Termos de Uso</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white tracking-wider">
          Termos de <span className="text-[#ea580c] dark:text-[#ff8838]">Uso</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-2">Última atualização: Julho de 2026</p>
      </header>

      <section className="space-y-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o portal Core Loop News, você concorda em cumprir e respeitar estes Termos de Uso e todas as leis e regulamentos aplicáveis.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">2. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo publicado neste site — incluindo artigos, textos, marcas e elementos gráficos — é protegido por direitos autorais. A reprodução não autorizada do conteúdo sem citação explícita da fonte é proibida.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">3. Limitação de Responsabilidade</h2>
          <p>
            O Core Loop News empenha-se em manter as informações atualizadas e precisas. No entanto, não nos responsabilizamos por erros tipográficos, falhas técnicas temporárias ou alterações efetuadas por terceiros.
          </p>
        </div>
      </section>

    </div>
  );
}
