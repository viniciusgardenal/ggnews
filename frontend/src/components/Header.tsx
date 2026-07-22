import Link from 'next/link';
import { api } from '@/lib/api';
import HeaderActions from '@/components/HeaderActions';

export default async function Header() {
  let categories: any[] = [];
  let settings: any = { site_name: 'Core Loop News', logo_url: null };

  try {
    // Fetch categories and settings in parallel to reduce load time
    const [fetchedCategories, fetchedSettings] = await Promise.all([
      api.getCategories(),
      api.getSettings(),
    ]);
    categories = fetchedCategories;
    settings = fetchedSettings;
  } catch (error) {
    console.error('Failed to load header data:', error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1f2833]/60 bg-[#0b0c10]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {settings.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings.site_name} 
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="relative">
              <span className="text-2xl font-black tracking-wider uppercase text-white">
                CORE<span className="text-[#66fcf1] transition-colors group-hover:text-rose-500">LOOP</span>
              </span>
              <span className="absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 bg-[#66fcf1] transition-transform duration-300 group-hover:scale-x-100 origin-left" />
            </div>
          )}
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-semibold tracking-wide uppercase text-slate-300 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="text-sm font-semibold tracking-wide uppercase text-slate-400 hover:text-[#66fcf1] transition-colors duration-200"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Action Button & Interactive Search & Mobile Menu Drawer */}
        <HeaderActions categories={categories} />
      </div>
    </header>
  );
}
