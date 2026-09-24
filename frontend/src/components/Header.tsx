import Link from 'next/link';
import { api } from '@/lib/api';
import HeaderActions from '@/components/HeaderActions';

export default async function Header() {
  let categories: any[] = [];
  let settings: any = { site_name: 'NEXUS', logo_url: null };

  try {
    const [fetchedCategories, fetchedSettings] = await Promise.all([
      api.getCategories().catch(() => []),
      api.getSettings().catch(() => ({ site_name: 'NEXUS' })),
    ]);
    categories = fetchedCategories;
    settings = fetchedSettings;
  } catch (error) {
    console.error('Failed to load header data:', error);
  }

  if (!categories || categories.length === 0) {
    categories = [
      { id: 1, name: 'Games', slug: 'games' },
      { id: 2, name: 'PlayStation', slug: 'playstation' },
      { id: 3, name: 'Xbox', slug: 'xbox' },
      { id: 4, name: 'Nintendo', slug: 'nintendo' },
      { id: 5, name: 'PC Gaming', slug: 'pc-gaming' },
      { id: 6, name: 'Reviews', slug: 'reviews' },
    ];
  }

  const siteName = settings.site_name || 'NEXUS';

  return (
    <div className="sticky top-3 z-50 w-full px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-300">
      
      {/* Clean Floating Header Bar */}
      <header className="relative flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 rounded-2xl floating-glass border border-slate-200/80 dark:border-cyan-500/25 shadow-sm dark:shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(0,240,255,0.1)]">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group relative z-10">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/80 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-500/20" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" className="fill-cyan-500" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider uppercase text-slate-900 dark:text-white font-mono">
              {siteName}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Portal de Games & Consoles
            </span>
          </div>
        </Link>

        {/* Center: Clean Quick Categories Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Actions (Search, Theme, Mobile Menu) */}
        <div className="relative z-10">
          <HeaderActions categories={categories} />
        </div>

      </header>
    </div>
  );
}
