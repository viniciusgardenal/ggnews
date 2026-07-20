import Link from 'next/link';
import { api } from '@/lib/api';

export default async function Footer() {
  let settings: any = {
    site_name: 'Core Loop News',
    site_description: 'O seu portal definitivo de notícias gamer.',
    footer_links: [],
    social_links: []
  };

  try {
    settings = await api.getSettings();
  } catch (error) {
    console.error('Failed to load footer settings:', error);
  }

  // Helper for rendering social icon vector graphics
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        return (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#1f2833]/60 bg-[#07080a] text-slate-400 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & Description */}
          <div>
            <span className="text-xl font-black uppercase text-white tracking-widest">
              CORE<span className="text-[#66fcf1]">LOOP</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {settings.site_description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:items-center">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-sm">
                {settings.footer_links.map((link: any, idx: number) => (
                  <li key={idx}>
                    <Link href={link.url} className="hover:text-[#66fcf1] transition-colors duration-200">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="flex flex-col md:items-end">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Siga-nos</h4>
              <div className="flex gap-4">
                {settings.social_links.map((social: any, idx: number) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#0b0c10] border border-[#1f2833] rounded-full hover:border-[#66fcf1] hover:text-[#66fcf1] transition-all duration-200"
                    aria-label={`Siga-nos no ${social.platform}`}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1f2833]/30 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>© {currentYear} {settings.site_name}. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/politica-de-privacidade" className="hover:text-slate-400 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="hover:text-slate-400 transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
