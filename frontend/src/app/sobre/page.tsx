import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quem Somos | Core Loop News',
  description: 'Conheça o Core Loop News, o portal definitivo de notícias, análises e coberturas do mundo dos games.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Quem Somos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white tracking-wider">
          Quem <span className="text-[#ea580c] dark:text-[#ff8838]">Somos</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Conheça a história e os princípios editoriais do Core Loop News.
        </p>
      </header>

      <section className="space-y-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
        <p className="text-base font-semibold text-zinc-900 dark:text-white">
          O <strong className="text-[#ea580c] dark:text-[#ff8838]">Core Loop News (CLN)</strong> nasceu da paixão por games e da busca por um jornalismo independente, dinâmico e direto ao ponto.
        </p>
        
        <p>
          O nome &quot;Core Loop&quot; é uma homenagem ao conceito fundamental do game design — o ciclo essencial de ações que torna um jogo envolvente. Da mesma forma, nosso compromisso diário é manter os leitores informados, entretidos e conectados às principais novidades do universo gamer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-2 shadow-sm">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider">🎯 Missão</h3>
            <p className="text-xs text-zinc-500">
              Entregar análises imparciais, notícias em tempo real e conteúdos aprofundados sobre a indústria de jogos e eSports.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-2 shadow-sm">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider">⚡ Visão</h3>
            <p className="text-xs text-zinc-500">
              Ser o veículo de comunicação de referência em língua portuguesa para a nova geração de jogadores e entusiastas.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-2 shadow-sm">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider">🛡️ Valores</h3>
            <p className="text-xs text-zinc-500">
              Transparência editorial, independência de crítica, respeito à comunidade e paixão pelo entretenimento digital.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
