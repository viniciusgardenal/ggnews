import Link from 'next/link';
import { Article } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Estimate reading time in minutes (approx 200 words per min)
  const textLength = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(textLength / 200));

  const coverImage = article.cover_image || '/images/placeholder-game.jpg';

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#1f2833]/60 bg-[#0b0c10] transition-all duration-300 hover:-translate-y-1 neon-border">
      
      {/* Article Cover Image Container */}
      <Link href={`/${article.category.slug}/${article.slug}`} className="relative block aspect-video overflow-hidden">
        <img
          src={coverImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/80 via-transparent to-transparent opacity-60" />
        
        {/* Category Badge overlay */}
        <span className="absolute left-4 top-4 rounded bg-rose-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
          {article.category.name}
        </span>

        {/* Read Time badge */}
        <span className="absolute right-4 top-4 rounded bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-slate-300">
          ⏱️ {readTimeMinutes} min
        </span>
      </Link>

      {/* Card Metadata and Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">{article.author.name}</span>
            <span>•</span>
            <time dateTime={article.published_at}>{publishedDate}</time>
          </div>
          {typeof article.views_count === 'number' && (
            <span className="text-[11px] text-slate-500">
              👁️ {article.views_count}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#66fcf1]">
          <Link href={`/${article.category.slug}/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm text-slate-400 mb-4 flex-1">
          {article.excerpt}
        </p>

        <div className="pt-2 border-t border-[#1f2833]/40">
          <Link 
            href={`/${article.category.slug}/${article.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#66fcf1] group-hover:text-white transition-colors duration-200"
          >
            Ler Matéria
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
