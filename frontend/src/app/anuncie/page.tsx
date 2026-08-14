import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anuncie Conosco | Core Loop News',
  description: 'Conecte sua marca aos jogadores e entusiastas de tecnologia com o Core Loop News. Conheça nossos formatos de anúncio e Mídia Kit.',
};

export default function AdvertisePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header section */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Publicidade</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white tracking-wider">
          Anuncie no <span className="text-[#ea580c] dark:text-[#ff8838]">Core Loop</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Conecte sua marca diretamente a uma audiência qualificada e engajada com o universo dos games e eSports.
        </p>
      </header>

      {/* Metrics Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 text-center space-y-2 shadow-sm">
          <span className="text-3xl font-black text-[#ea580c] dark:text-[#ff8838]">100%</span>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Público Gamer</h4>
          <p className="text-xs text-zinc-500">Leitores apaixonados por lançamentos, consoles, hardware e competições.</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 text-center space-y-2 shadow-sm">
          <span className="text-3xl font-black text-[#ea580c] dark:text-[#ff8838]">Display & Branded</span>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Formatos Variados</h4>
          <p className="text-xs text-zinc-500">Banners responsivos, matérias patrocinadas (publieditoriais) e patrocínio de categorias.</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 text-center space-y-2 shadow-sm">
          <span className="text-3xl font-black text-[#ea580c] dark:text-[#ff8838]">Multiplataforma</span>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Alcance Integrado</h4>
          <p className="text-xs text-zinc-500">Presença no portal web, newsletter e redes sociais do ecossistema CLN.</p>
        </div>
      </section>

      {/* Formats Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
          Formatos de <span className="text-[#ea580c] dark:text-[#ff8838]">Parceria</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white">📰 Publieditoriais & Análises</h3>
            <p className="text-zinc-500 leading-relaxed">
              Cobertura aprofundada de produtos, jogos ou periféricos desenvolvida pelo nosso time editorial com sinalização transparente de conteúdo patrocinado.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white">🎯 Banners de Destaque</h3>
            <p className="text-zinc-500 leading-relaxed">
              Posições de alto impacto no Top Leaderboard, entre os artigos da página inicial e na barra lateral de matérias.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0b0c10] p-8 text-center space-y-4 shadow-sm">
        <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-wider">
          Pronto para anunciar com o Core Loop News?
        </h3>
        <p className="text-xs text-zinc-500 max-w-xl mx-auto">
          Solicite nosso Mídia Kit atualizado com tabelas de formatos e valores comerciais diretamente com nosso time.
        </p>
        <div>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] dark:bg-[#ff8838] hover:bg-[#c2410c] dark:hover:bg-[#e06818] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all"
          >
            Falar com a Equipe Comercial →
          </Link>
        </div>
      </section>

    </div>
  );
}
