import Link from 'next/link';
import { Clock, Eye, ArrowUpRight, Cpu, Zap, Gamepad2, Laptop, Sparkles } from 'lucide-react';
import { Article } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'panoramic' | 'tower';
  index?: number;
}

export default function ArticleCard({ article, variant = 'standard', index }: ArticleCardProps) {
  const publishedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const textLength = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(textLength / 200));
  const coverImage = article.cover_image || '/images/placeholder-game.jpg';

  const getCategoryTheme = (slug: string) => {
    switch (slug?.toLowerCase()) {
      case 'games':
      case 'cyberspace':
      case 'lancamentos':
        return {
          badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
          hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
          border: 'border-slate-200 dark:border-cyan-500/25 hover:border-cyan-500/50',
          glow: 'hover:shadow-[0_10px_30px_rgba(2,132,199,0.12)]',
          line: 'bg-cyan-500',
          accent: 'text-cyan-600 dark:text-cyan-400',
          icon: Gamepad2,
        };
      case 'playstation':
        return {
          badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
          hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
          border: 'border-slate-200 dark:border-blue-500/25 hover:border-blue-500/50',
          glow: 'hover:shadow-[0_10px_30px_rgba(37,99,235,0.12)]',
          line: 'bg-blue-500',
          accent: 'text-blue-600 dark:text-blue-400',
          icon: Gamepad2,
        };
      case 'xbox':
        return {
          badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
          border: 'border-slate-200 dark:border-emerald-500/25 hover:border-emerald-500/50',
          glow: 'hover:shadow-[0_10px_30px_rgba(16,185,129,0.12)]',
          line: 'bg-emerald-500',
          accent: 'text-emerald-600 dark:text-emerald-400',
          icon: Gamepad2,
        };
      case 'nintendo':
        return {
          badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
          hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
          border: 'border-slate-200 dark:border-rose-500/25 hover:border-rose-500/50',
          glow: 'hover:shadow-[0_10px_30px_rgba(225,29,72,0.12)]',
          line: 'bg-rose-500',
          accent: 'text-rose-600 dark:text-rose-400',
          icon: Sparkles,
        };
      case 'pc-gaming':
        return {
          badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
          hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
          border: 'border-slate-200 dark:border-amber-500/25 hover:border-amber-500/50',
          glow: 'hover:shadow-[0_10px_30px_rgba(245,158,11,0.12)]',
          line: 'bg-amber-500',
          accent: 'text-amber-600 dark:text-amber-400',
          icon: Laptop,
        };
      case 'reviews':
      default:
        return {
          badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
          hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
          border: 'border-slate-200 dark:border-purple-500/25 hover:border-purple-500/50',
          glow: 'hover:shadow-[0_10px_30px_rgba(168,85,247,0.12)]',
          line: 'bg-purple-500',
          accent: 'text-purple-600 dark:text-purple-400',
          icon: Sparkles,
        };
    }
  };

  const theme = getCategoryTheme(article.category?.slug);
  const CategoryIcon = theme.icon;

  // PANORAMIC WIDE VARIANT
  if (variant === 'panoramic') {
    return (
      <article className={`group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border ${theme.border} bg-white dark:bg-[#070b16] ${theme.glow} transition-all duration-300 shadow-sm hover:-translate-y-1`}>
        <Link href={`/${article.category?.slug}/${article.slug}`} className="relative md:w-5/12 aspect-video md:aspect-auto overflow-hidden bg-slate-900">
          <img
            src={coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-white dark:via-[#070b16]/40 dark:to-[#070b16] hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent dark:from-[#070b16] md:hidden" />
          
          <div className="absolute left-4 top-4 z-10">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${theme.badge}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {article.category?.name}
            </span>
          </div>
        </Link>

        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className={`font-semibold ${theme.accent}`}>{article.author?.name || 'Redação'}</span>
              <span>•</span>
              <time dateTime={article.published_at}>{publishedDate}</time>
            </div>

            <h3 className={`text-lg sm:text-xl font-bold leading-snug text-slate-900 dark:text-white transition-colors duration-200 line-clamp-2 ${theme.hoverText}`}>
              <Link href={`/${article.category?.slug}/${article.slug}`}>
                {article.title}
              </Link>
            </h3>

            <p className="line-clamp-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {readTimeMinutes} min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {article.views_count || 4200}
              </span>
            </div>

            <Link 
              href={`/${article.category?.slug}/${article.slug}`}
              className={`inline-flex items-center gap-1 font-bold ${theme.accent} hover:underline transition-colors`}
            >
              <span>Ler Matéria</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // TOWER VERTICAL VARIANT
  if (variant === 'tower') {
    return (
      <article className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${theme.border} bg-white dark:bg-[#070b16] ${theme.glow} transition-all duration-300 p-6 shadow-sm hover:-translate-y-1`}>
        <Link href={`/${article.category?.slug}/${article.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-900 mb-4">
          <img
            src={coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${theme.badge}`}>
              <CategoryIcon className="w-3 h-3" />
              {article.category?.name}
            </span>
          </div>
        </Link>

        <div className="flex-1 flex flex-col justify-between space-y-3">
          <h3 className={`text-base font-bold leading-snug text-slate-900 dark:text-white transition-colors duration-200 line-clamp-2 ${theme.hoverText}`}>
            <Link href={`/${article.category?.slug}/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="line-clamp-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">{article.author?.name || 'Redação'}</span>
            <Link 
              href={`/${article.category?.slug}/${article.slug}`}
              className={`inline-flex items-center gap-1 ${theme.accent} hover:underline font-bold`}
            >
              <span>Ler Mais</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // STANDARD CARD
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border ${theme.border} bg-white dark:bg-[#070b16] transition-all duration-300 hover:-translate-y-1 ${theme.glow} shadow-sm`}>
      
      {/* Article Cover Image */}
      <Link href={`/${article.category?.slug}/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={coverImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent dark:from-[#070b16] dark:via-[#070b16]/30" />
        
        {/* Category Badge */}
        <div className="absolute left-4 top-4 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${theme.badge}`}>
            <CategoryIcon className="w-3 h-3" />
            {article.category?.name}
          </span>
        </div>

        {/* Read Time & Views Overlay */}
        <div className="absolute right-4 bottom-3 z-10 flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-0.5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm">
            <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            {readTimeMinutes} min
          </span>
          {typeof article.views_count === 'number' && (
            <span className="flex items-center gap-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-0.5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm">
              <Eye className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              {article.views_count}
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className={`font-semibold ${theme.accent}`}>{article.author?.name || 'Redação'}</span>
            <span>•</span>
            <time dateTime={article.published_at}>{publishedDate}</time>
          </div>

          <h3 className={`text-base font-bold leading-snug text-slate-900 dark:text-white transition-colors duration-200 line-clamp-2 ${theme.hoverText}`}>
            <Link href={`/${article.category?.slug}/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link 
            href={`/${article.category?.slug}/${article.slug}`}
            className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${theme.accent} hover:underline transition-colors`}
          >
            <span>Ler Matéria</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}
