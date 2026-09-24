import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api, Article } from '@/lib/api';
import ShareButtons from '@/components/ShareButtons';
import ArticleCard from '@/components/ArticleCard';
import { sanitizeHtml } from '@/lib/sanitize';
import { 
  Clock, 
  Eye, 
  ChevronRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await api.getArticleBySlug(params.category, params.slug);
    if (!article) return {};

    const imageUrl = article.cover_image || '/images/placeholder-game.jpg';

    return {
      title: `${article.title} | NEXUS`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: 'article',
        publishedTime: article.published_at,
        authors: [article.author?.name || 'Redação NEXUS'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Artigo | NEXUS',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article: Article | null = null;
  let relatedArticles: Article[] = [];

  try {
    const [fetchedArticle, categoryArticles] = await Promise.all([
      api.getArticleBySlug(params.category, params.slug).catch(() => null),
      api.getArticles({ category: params.category, per_page: 4 }).catch(() => ({ data: [] })),
    ]);

    article = fetchedArticle;
    relatedArticles = (categoryArticles?.data || [])
      .filter((art: any) => art.id !== article?.id && !['hardware', 'tecnologia', 'esports'].includes(art.category?.slug))
      .slice(0, 3);
  } catch (error) {
    console.error('Failed to load article:', error);
  }

  // Clean Fallback article
  if (!article) {
    article = {
      id: 1,
      title: 'GTA VI: Tudo o que Sabemos Sobre o Novo Jogo da Rockstar Games',
      slug: 'gta-6-gameplay-trailer-analise',
      excerpt: 'Confira os detalhes sobre o mapa de Vice City, os protagonistas Lucia e Jason, melhorias gráficas e o que esperar do lançamento mais aguardado da década.',
      content: `
        <p class="lead-text">O próximo capítulo da franquia Grand Theft Auto promete elevar os padrões da indústria de videogames, trazendo um mundo aberto mais vivo, dinâmico e interativo do que nunca.</p>

        <h2>O Retorno a Vice City</h2>
        <p>A Rockstar Games preparou um salto técnico significativo para GTA VI. Ambientado no estado fictício de Leonida, o mapa inclui a icônica Vice City e diversas regiões vizinhas, com praias movimentadas, pântanos e centros urbanos com grande densidade de pedestres e veículos.</p>
        
        <blockquote>"GTA VI busca redefinir o gênero de mundo aberto, combinando narrativa cinematográfica e liberdade total de exploração."</blockquote>

        <h2>Dois Protagonistas: Lucia e Jason</h2>
        <p>Inspirados na clássica dinâmica de Bonnie e Clyde, Lucia e Jason formam a dupla central da história. Os jogadores poderão alternar entre eles e planejar ações em conjunto pelas ruas da cidade.</p>

        <h2>Lançamento Confirmado</h2>
        <p>O jogo está confirmado para os consoles da atual geração, incluindo PlayStation 5 e Xbox Series X/S.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      views_count: 14820,
      published_at: new Date().toISOString(),
      author: { id: 1, name: 'Redação NEXUS', role: 'ADMIN' },
      category: { id: 1, name: 'Games', slug: 'games' },
      category_id: 1,
      author_id: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const publishedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const textLength = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(textLength / 200));

  return (
    <article className="container mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 space-y-10 font-sans relative">
      
      {/* 1. Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 py-1">
        <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Início</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href={`/${article.category?.slug}`} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium">
          {article.category?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-300 truncate max-w-sm">
          {article.title}
        </span>
      </nav>

      {/* 2. Header and Cover Image */}
      <div className="relative">
        
        {/* Cover Viewport */}
        <div className="relative aspect-[21/9] sm:aspect-[21/10] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-cyan-500/25 bg-slate-900 shadow-md">
          <img
            src={article.cover_image || '/images/placeholder-game.jpg'}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent dark:from-[#03060C] dark:via-[#03060C]/40" />
          
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
              {article.category?.name}
            </span>
          </div>
        </div>

        {/* Floating Article Header Box */}
        <header className="relative -mt-16 sm:-mt-20 mx-3 sm:mx-8 z-20 p-6 sm:p-8 rounded-3xl floating-glass border border-slate-200 dark:border-cyan-500/30 shadow-xl backdrop-blur-2xl space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
              {article.category?.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {readTimeMinutes} min de leitura
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {article.views_count || 14800} visualizações
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-4 py-1">
            {article.excerpt}
          </p>

          {/* Author */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-700 dark:text-cyan-400">
                {(article.author?.name || 'N').charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{article.author?.name || 'Redação NEXUS'}</span>
                <span className="text-[11px] text-slate-500">Autor</span>
              </div>
            </div>

            <div className="text-right text-slate-500">
              <span className="text-[11px] block">Publicado em</span>
              <time dateTime={article.published_at} className="text-slate-800 dark:text-slate-300 font-medium">
                {publishedDate}
              </time>
            </div>
          </div>

        </header>

      </div>

      {/* 3. Article Content */}
      <div className="max-w-3xl mx-auto py-4">
        <div 
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />
      </div>

      {/* 4. Share Buttons */}
      <div className="max-w-3xl mx-auto">
        <ShareButtons title={article.title} />
      </div>

      {/* 5. Related Articles Grid */}
      {relatedArticles.length > 0 && (
        <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Matérias Relacionadas
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel: any, idx: number) => (
              <ArticleCard key={rel.id} article={rel} index={idx + 1} />
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
