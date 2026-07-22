import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, Article } from '@/lib/api';
import ShareButtons from '@/components/ShareButtons';
import ArticleCard from '@/components/ArticleCard';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

// Generate dynamic SEO tags for the specific article
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await api.getArticleBySlug(params.category, params.slug);
    
    if (!article) return {};

    const imageUrl = article.cover_image || '/images/placeholder-game.jpg';

    return {
      title: `${article.title} | Core Loop News`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: 'article',
        publishedTime: article.published_at,
        authors: [article.author.name],
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
      title: 'Artigo | Core Loop News',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article: Article | null = null;
  let relatedArticles: Article[] = [];

  try {
    const [fetchedArticle, categoryArticles] = await Promise.all([
      api.getArticleBySlug(params.category, params.slug),
      api.getArticles({ category: params.category, per_page: 4 }).catch(() => ({ data: [] })),
    ]);

    article = fetchedArticle;
    relatedArticles = categoryArticles.data.filter((art: any) => art.id !== article?.id).slice(0, 3);
  } catch (error) {
    console.error('Failed to load article:', error);
    notFound();
  }

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const textLength = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(textLength / 200));

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* 1. Header Metadata Section */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block rounded bg-rose-600 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white">
            {article.category.name}
          </span>
          <span className="text-xs font-bold text-slate-400 bg-zinc-800/80 px-2.5 py-1 rounded">
            ⏱️ {readTimeMinutes} min de leitura
          </span>
          {typeof article.views_count === 'number' && (
            <span className="text-xs font-bold text-slate-400 bg-zinc-800/80 px-2.5 py-1 rounded">
              👁️ {article.views_count} visualizações
            </span>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
          {article.title}
        </h1>

        <p className="text-lg text-slate-400 font-medium leading-relaxed mb-6 border-l-2 border-[#66fcf1] pl-4">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[#1f2833]/40 py-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#1f2833] flex items-center justify-center border border-[#66fcf1]">
              <span className="text-sm font-bold text-[#66fcf1]">
                {article.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">{article.author.name}</p>
              <p className="text-xs text-slate-500 mt-1">Autor Core Loop News</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="text-right sm:text-left">
            <p className="text-xs text-slate-500">Publicado em</p>
            <time className="text-sm font-semibold text-slate-400 mt-1" dateTime={article.published_at}>
              {publishedDate}
            </time>
          </div>
        </div>
      </header>

      {/* 2. Cover Image Banner */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#1f2833]/60 mb-10 shadow-2xl">
        <img
          src={article.cover_image || '/images/placeholder-game.jpg'}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 3. Article Content (WYSIWYG/Rich Text styling) */}
      <div 
        className="prose-gamer mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* 4. Footer & Social Sharing bar */}
      <footer className="border-t border-[#1f2833]/40 pt-6 space-y-12">
        <ShareButtons title={article.title} />

        {/* 5. Related Articles Section ("Leia Também") */}
        {relatedArticles.length > 0 && (
          <section className="pt-8 border-t border-[#1f2833]/40">
            <h3 className="text-xl font-black uppercase text-white tracking-wider mb-6">
              Leia <span className="text-[#66fcf1]">Também</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel: any) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        )}
      </footer>

    </article>
  );
}
