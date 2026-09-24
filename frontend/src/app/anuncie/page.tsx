import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, ChevronRight, Layers, Megaphone, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Anuncie Conosco | NEXUS',
  description: 'Conecte sua marca a milhares de apaixonados por jogos, videogames e consoles.',
};

export default function AdvertisePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 font-sans">
      
      {/* Header section */}
      <header className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] space-y-4 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Anuncie</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Mídia & Parcerias</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
          Anuncie no NEXUS
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Apresente seus lançamentos, jogos ou serviços diretamente para um público altamente engajado e apaixonado por videogames e entretenimento digital.
        </p>
      </header>

      {/* Metrics Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] p-6 text-center space-y-2 shadow-sm">
          <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">100%</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Público Gamer</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Jogadores ativos de PlayStation, Xbox, Nintendo e PC.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-purple-500/20 bg-white dark:bg-[#070b14] p-6 text-center space-y-2 shadow-sm">
          <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">45k+</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Leituras Mensais</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Alcance orgânico com matérias diárias e alto engajamento da comunidade.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-[#070b14] p-6 text-center space-y-2 shadow-sm">
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Design</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Limpo e Sem Poluição</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Integração visual elegante com a experiência do leitor sem anúncios intrusivos.</p>
        </div>
      </section>

      {/* Formats Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span>Formatos de Parceria</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-cyan-600 dark:text-cyan-400">Conteúdo Patrocinado & Reviews</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Apresentação detalhada do seu produto, jogo ou acessório com cobertura aprofundada feita pela nossa equipe editorial.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-purple-600 dark:text-purple-400">Patrocínio de Categorias</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Destaque especial da sua marca em seções específicas do portal, como PlayStation, Xbox, Nintendo ou PC Gaming.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-slate-50 dark:bg-black/50 p-8 sm:p-10 text-center space-y-4 shadow-sm">
        <h3 className="text-xl font-bold uppercase text-slate-900 dark:text-white tracking-tight">
          Quer divulgar seu projeto no NEXUS?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Entre em contato com nossa equipe comercial para receber nossa proposta com formatos e condições personalizadas.
        </p>
        <div className="pt-2">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-sm transition-all"
          >
            <span>Falar com a Equipe Comercial</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      </section>

    </div>
  );
}
