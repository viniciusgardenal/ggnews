import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Activity,
  Sliders,
  Sparkles,
  Gamepad2,
  Clock,
  Eye,
  ChevronRight
} from 'lucide-react';

export const revalidate = 60; // Refresh index page cache every 60s

export default async function HomePage() {
  let featuredArticle: any = null;
  let latestArticles: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedFeatured, fetchedArticles, fetchedCategories] = await Promise.all([
      api.getFeaturedArticle().catch(() => null),
      api.getArticles({ per_page: 12 }),
      api.getCategories().catch(() => []),
    ]);

    featuredArticle = fetchedFeatured;
    // Filter out hardware, tecnologia, esports
    categories = (fetchedCategories || []).filter(c => !['hardware', 'tecnologia', 'esports'].includes(c.slug));
    
    latestArticles = (fetchedArticles?.data || []).filter(
      (article) => article.id !== featuredArticle?.id && !['hardware', 'tecnologia', 'esports'].includes(article.category?.slug)
    );

  } catch (error) {
    console.error('Failed to load homepage feeds:', error);
  }

  // Clean Fallback data (100% Video Games & Consoles)
  if (!featuredArticle && latestArticles.length === 0) {
    featuredArticle = {
      id: 1,
      title: 'GTA VI: Tudo o que Sabemos Sobre o Novo Jogo da Rockstar Games',
      slug: 'gta-6-gameplay-trailer-analise',
      excerpt: 'Confira os detalhes sobre o mapa de Vice City, os protagonistas Lucia e Jason, melhorias gráficas e o que esperar do lançamento mais aguardado da década.',
      cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      published_at: new Date().toISOString(),
      views_count: 15420,
      author: { name: 'Redação NEXUS' },
      category: { name: 'Games', slug: 'games' },
    };

    latestArticles = [
      {
        id: 2,
        title: 'PlayStation 5 Pro: Testamos as Melhorias de Desempenho e Ray Tracing nos Jogos',
        slug: 'ps5-pro-analise-desempenho-jogos',
        excerpt: 'Analisamos como os principais games rodam no novo console da Sony: estabilidade a 60 FPS, upscaling PSSR e comparativo com o modelo base.',
        cover_image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 19800,
        author: { name: 'Redação NEXUS' },
        category: { name: 'PlayStation', slug: 'playstation' },
      },
      {
        id: 3,
        title: 'Nintendo Switch 2: Previsão de Lançamento e os Primeiros Jogos Esperados',
        slug: 'nintendo-switch-2-jogos-e-detalhes',
        excerpt: 'Rumores da indústria e informações oficiais indicam retrocompatibilidade total com o Switch atual e uma nova aventura de Mario em 3D.',
        cover_image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 12450,
        author: { name: 'Redação NEXUS' },
        category: { name: 'Nintendo', slug: 'nintendo' },
      },
      {
        id: 4,
        title: 'Review: Black Myth Wukong Impressiona com Gráficos Incríveis e Combate Desafiador',
        slug: 'black-myth-wukong-review-tecnica',
        excerpt: 'Testamos a jornada do Rei Macaco no PC e consoles: direção de arte deslumbrante, chefes memoráveis e ótima ambientação da mitologia chinesa.',
        cover_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 11200,
        author: { name: 'Redação NEXUS' },
        category: { name: 'Reviews', slug: 'reviews' },
      },
      {
        id: 5,
        title: 'Xbox Game Pass: Confira os Grandes Lançamentos Chegando ao Catálogo',
        slug: 'xbox-game-pass-novidades-jogos',
        excerpt: 'Grandes RPGs, produções de peso da Xbox Game Studios e novidades imperdíveis no serviço de assinatura da Microsoft.',
        cover_image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 8930,
        author: { name: 'Redação NEXUS' },
        category: { name: 'Xbox', slug: 'xbox' },
      },
      {
        id: 6,
        title: 'Elden Ring: Shadow of the Erdtree Conquista Nota Recorde da Crítica Especializada',
        slug: 'elden-ring-shadow-erdtree-analise',
        excerpt: 'A expansão da FromSoftware expande as Terras Intermédias com novos chefes brutais, armas inéditas e segredos profundos.',
        cover_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 14500,
        author: { name: 'Redação NEXUS' },
        category: { name: 'Games', slug: 'games' },
      },
      {
        id: 7,
        title: 'Death Stranding 2: Hideo Kojima Revela Detalhes Inéditos de Gameplay no PS5',
        slug: 'death-stranding-2-novidades-gameplay',
        excerpt: 'Novos trailers conceituais destacam física climática em tempo real, novos personagens e evolução da jogabilidade.',
        cover_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 9800,
        author: { name: 'Redação NEXUS' },
        category: { name: 'PlayStation', slug: 'playstation' },
      },
      {
        id: 8,
        title: 'Metroid Prime 4 Beyond: Trailer Oficial Mostra Retorno Triunfal de Samus Aran',
        slug: 'metroid-prime-4-beyond-revelacao',
        excerpt: 'Novo gameplay confirma exploração imersiva em primeira pessoa, novos visores e previsão de lançamento para Nintendo Switch.',
        cover_image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 10400,
        author: { name: 'Redação NEXUS' },
        category: { name: 'Nintendo', slug: 'nintendo' },
      },
      {
        id: 9,
        title: 'Steam Quebra Recorde Histórico de Usuários Simultâneos Jogando no PC',
        slug: 'steam-recorde-historico-usuarios',
        excerpt: 'A plataforma da Valve registra marcas históricas impulsionada por grandes lançamentos e promoções sazonais de games.',
        cover_image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        views_count: 8700,
        author: { name: 'Redação NEXUS' },
        category: { name: 'PC Gaming', slug: 'pc-gaming' },
      }
    ];
  }

  const featuredDate = featuredArticle 
    ? new Date(featuredArticle.published_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const trendingArticles = latestArticles.slice(0, 3);

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 space-y-16 font-sans">
      
      {/* ====================================================================
          1. DESTAQUE PRINCIPAL (HERO SECTION COM CARD FLUTUANTE)
          ==================================================================== */}
      <section className="relative pt-2 pb-10 sm:pb-14">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Featured Hero (Cols 1-8) */}
          {featuredArticle && (
            <div className="lg:col-span-8 relative">
              
              {/* Image Viewport */}
              <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-cyan-500/30 bg-slate-900 shadow-md group">
                <img
                  src={featuredArticle.cover_image || '/images/placeholder-game.jpg'}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent dark:from-[#03060C] dark:via-[#03060C]/50" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    {featuredArticle.category?.name || 'Games'}
                  </span>
                </div>
              </div>

              {/* Floating Overlapping Card */}
              <div className="relative lg:absolute -mt-12 sm:-mt-16 lg:mt-0 lg:-bottom-8 lg:left-6 right-0 lg:right-8 z-30 p-6 sm:p-8 rounded-2xl floating-glass border border-slate-200 dark:border-cyan-500/30 shadow-xl backdrop-blur-2xl transition-all duration-300">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3 text-xs">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                    Matéria em Destaque
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {featuredDate} • {featuredArticle.author?.name || 'Redação NEXUS'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-3">
                  <Link href={`/${featuredArticle.category?.slug}/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h1>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-2">
                  {featuredArticle.excerpt}
                </p>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                    <span>{featuredArticle.views_count ? `${featuredArticle.views_count} visualizações` : 'Em alta'}</span>
                  </span>

                  <Link
                    href={`/${featuredArticle.category?.slug}/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-sm group/btn"
                  >
                    <span>Ler Matéria Completa</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                </div>

              </div>

            </div>
          )}

          {/* Right Flank: Mais Lidas (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#070b16] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Mais Lidas</span>
              </div>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Em Alta
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {trendingArticles.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/${article.category?.slug}/${article.slug}`}
                  className="group relative flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b16] hover:bg-cyan-500/5 hover:border-cyan-500/40 transition-all duration-200 shadow-sm hover:-translate-x-1"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-black/60 font-bold text-sm text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                    0{idx + 1}
                  </div>

                  <img
                    src={article.cover_image || '/images/placeholder-game.jpg'}
                    alt={article.title}
                    className="w-16 h-14 rounded-xl object-cover bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400 block mb-0.5">
                      {article.category?.name}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ====================================================================
          2. NAVEGAÇÃO POR CATEGORIA (BARRA LIMPA E ENXUTA)
          ==================================================================== */}
      <section className="relative">
        <div className="p-4 sm:p-5 rounded-2xl floating-glass border border-slate-200 dark:border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wider">
                Navegue por Categoria
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Selecione o tema para filtrar as matérias
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-400 text-black shadow-sm shrink-0"
            >
              Todas
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-black/40 hover:bg-cyan-500/10 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          3. ÚLTIMAS NOTÍCIAS (FEED EXPANDIDO DE MINI-BLOCOS COM TÍTULOS AO LADO)
          ==================================================================== */}
      <section className="rounded-3xl border border-slate-200/80 dark:border-cyan-500/25 bg-white/95 dark:bg-[#070b16]/90 p-5 sm:p-8 lg:p-10 shadow-sm space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Feed Contínuo de Games</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
                Últimas Notícias
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                {latestArticles.length} matérias
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Atualizado em tempo real</span>
          </div>
        </div>

        {/* Lista de Mini Blocos com Título ao Lado (2 colunas) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {latestArticles.map((article, idx) => {
            const catSlug = article.category?.slug || 'games';
            const badgeColor = 
              catSlug === 'playstation' ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/25' :
              catSlug === 'xbox' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25' :
              catSlug === 'nintendo' ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25' :
              catSlug === 'pc-gaming' ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25' :
              catSlug === 'reviews' ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/25' :
              'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/25';

            const articleDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            });

            return (
              <Link
                key={article.id}
                href={`/${article.category?.slug || 'games'}/${article.slug}`}
                className="group relative flex items-center sm:items-start gap-4 sm:gap-5 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-black/40 hover:bg-white dark:hover:bg-cyan-950/20 hover:border-cyan-500/40 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Mini Imagem / Mini Bloco */}
                <div className="relative w-28 h-24 sm:w-36 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-cyan-500/40">
                  <img
                    src={article.cover_image || '/images/placeholder-game.jpg'}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute bottom-1.5 left-1.5 text-[10px] font-mono font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    #{String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Conteúdo ao Lado: Categoria, Título e Meta */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                      {article.category?.name || 'Games'}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {articleDate}
                    </span>
                  </div>

                  {/* Título ao Lado */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {article.title}
                  </h3>

                  {/* Resumo curto em telas maiores */}
                  {article.excerpt && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed hidden sm:block">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Footer Meta */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                    <span>{article.author?.name || 'Redação'}</span>
                    {article.views_count && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        <span>{article.views_count}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Chevron Right indicator */}
                <div className="hidden sm:flex items-center text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all pr-1">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Section Footer Callout */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mostrando as matérias mais recentes publicadas pela equipe editorial do NEXUS.
          </span>

          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/10 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Ver Todas as Matérias</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* ====================================================================
          4. SEÇÃO PLATAFORMAS & UNIVERSOS DE GAMES
          ==================================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-cyan-500/25 bg-white dark:bg-[#070b16] p-6 sm:p-10 shadow-sm">
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-600 dark:text-cyan-400 font-bold">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Plataformas & Videogames</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight leading-tight">
              Tudo Sobre PlayStation, Xbox, Nintendo e PC
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Fique por dentro das novidades exclusivas de cada plataforma, atualizações do catálogo do Xbox Game Pass, grandes produções da PlayStation Studios e os universos mágicos da Nintendo.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/playstation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <span>Ver Jogos PlayStation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/xbox"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/10 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Explorar Xbox</span>
              </Link>
            </div>
          </div>

          {/* Clean Gaming Platform Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 text-xs">
            <Link href="/playstation" className="p-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-blue-500/20 space-y-1.5 shadow-sm hover:border-blue-500/50 transition-colors">
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">PlayStation</span>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">PS5 & PS4</p>
              <span className="text-[11px] text-slate-500 block">Exclusivos e PS Plus</span>
            </Link>
            <Link href="/xbox" className="p-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-emerald-500/20 space-y-1.5 shadow-sm hover:border-emerald-500/50 transition-colors">
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">Xbox</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Series X|S</p>
              <span className="text-[11px] text-slate-500 block">Game Pass Day One</span>
            </Link>
            <Link href="/nintendo" className="p-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-rose-500/20 space-y-1.5 shadow-sm hover:border-rose-500/50 transition-colors">
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">Nintendo</span>
              <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400">Switch & Sucessor</p>
              <span className="text-[11px] text-slate-500 block">Mario, Zelda e Pokemons</span>
            </Link>
            <Link href="/pc-gaming" className="p-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-amber-500/20 space-y-1.5 shadow-sm hover:border-amber-500/50 transition-colors">
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">PC Gaming</span>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">Steam & Epic</p>
              <span className="text-[11px] text-slate-500 block">RPGs, Indies e Lançamentos</span>
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}
