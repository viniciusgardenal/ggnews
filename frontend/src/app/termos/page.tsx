import Link from 'next/link';
import { Metadata } from 'next';
import { Shield, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso | NEXUS',
  description: 'Termos e Condições de Uso do portal NEXUS.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Header */}
      <header className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] space-y-4 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Termos de Uso</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
          <Shield className="w-3.5 h-3.5" />
          <span>Termos & Condições</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
          Termos de Uso
        </h1>

        <p className="text-xs text-slate-500">Última atualização: Setembro de 2026</p>
      </header>

      {/* Content */}
      <section className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] shadow-sm">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">01.</span> Aceitação dos Termos
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Ao acessar e navegar pelo portal NEXUS, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Caso discorde de qualquer disposição, solicitamos que não continue a utilização dos nossos serviços.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">02.</span> Propriedade Intelectual e Uso do Conteúdo
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Todo o conteúdo publicado neste portal — incluindo textos, avaliações, comparativos e identidade visual — é protegido por leis de direitos autorais. A citação de trechos é permitida e incentivada, desde que acompanhada de créditos claros com link direto para o artigo original.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">03.</span> Isenção e Responsabilidade
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Nos esforçamos para fornecer informações precisas e verificadas. No entanto, datas de lançamento e especificações técnicas de produtos não lançados estão sujeitas a alterações por parte dos fabricantes e estúdios desenvolvedores.
          </p>
        </div>
      </section>

    </div>
  );
}
