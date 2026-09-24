import Link from 'next/link';
import { Metadata } from 'next';
import { Shield, Zap, Target, ChevronRight, Gamepad2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nós | NEXUS',
  description: 'Conheça o NEXUS, seu portal de notícias sobre jogos, consoles, análises e lançamentos.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 font-sans">
      
      {/* Header */}
      <header className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] space-y-4 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Sobre Nós</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Quem Somos</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
          Jornalismo Especializado em Games e Videogames
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          O <strong className="text-cyan-600 dark:text-cyan-400">NEXUS</strong> é um portal independente dedicado a cobrir os principais acontecimentos da indústria dos videogames, novidades de consoles e análises aprofundadas sobre o universo dos jogos.
        </p>
      </header>

      {/* Main Philosophy Section */}
      <section className="space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] shadow-sm">
        <h2 className="text-xl font-bold uppercase text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
          Nossa Missão
        </h2>

        <p>
          Nosso objetivo é fornecer aos jogadores um conteúdo claro, acessível e confiável. Seja você fã de PlayStation, Xbox, Nintendo ou PC Gaming, produzimos notícias diárias, guias e análises honestas sobre os principais títulos do mercado.
        </p>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-xl border border-slate-200 dark:border-cyan-500/20 bg-slate-50 dark:bg-black/50 p-6 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase">
              <Target className="w-4 h-4" />
              <span>Análises Rigorosas</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Testes práticos de jogos em diversas plataformas para trazer impressões reais e vereditos transparentes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-black/50 p-6 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
              <Zap className="w-4 h-4" />
              <span>Agilidade</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Notícias apuradas com rapidez para você ficar por dentro dos lançamentos e novidades sem enrolação.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-emerald-500/20 bg-slate-50 dark:bg-black/50 p-6 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
              <Shield className="w-4 h-4" />
              <span>Independência</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Opiniões sinceras com foco nos interesses da comunidade gamer e apaixonados por videogames.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
