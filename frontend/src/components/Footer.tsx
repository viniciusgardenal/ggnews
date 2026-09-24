import Link from 'next/link';
import { Mail, Send } from 'lucide-react';
import { api } from '@/lib/api';

export default async function Footer() {
  let settings: any = {
    site_name: 'NEXUS',
    site_description: 'Seu portal definitivo sobre o universo dos games, consoles, análises e lançamentos.',
    footer_links: [],
    social_links: []
  };

  try {
    settings = await api.getSettings().catch(() => settings);
  } catch (error) {
    console.error('Failed to load footer settings:', error);
  }

  const currentYear = new Date().getFullYear();

  const defaultFooterLinks = [
    { title: 'Sobre Nós', url: '/sobre' },
    { title: 'Contato', url: '/contato' },
    { title: 'Anuncie Conosco', url: '/anuncie' },
    { title: 'Política de Privacidade', url: '/politica-de-privacidade' },
    { title: 'Termos de Uso', url: '/termos' },
  ];

  const links = (settings.footer_links && settings.footer_links.length > 0) 
    ? settings.footer_links 
    : defaultFooterLinks;

  const siteName = settings.site_name || 'NEXUS';

  return (
    <footer className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-12 text-slate-500 font-sans relative">
      
      {/* Clean Modern Container */}
      <div className="rounded-3xl floating-glass border border-slate-200/80 dark:border-cyan-500/25 p-8 sm:p-12 relative overflow-hidden shadow-sm">
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Info (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/80 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-500/20" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" className="fill-cyan-500" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase text-slate-900 dark:text-white font-mono tracking-wider">
                  {siteName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Portal de Games & Consoles
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              {settings.site_description || 'Seu portal definitivo sobre o universo dos games, consoles, análises e lançamentos.'}
            </p>
          </div>

          {/* Quick Links (Cols 6-8) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Links Úteis
            </h4>
            <ul className="space-y-2 text-xs">
              {links.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link 
                    href={link.url} 
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 py-0.5 text-slate-600 dark:text-slate-300"
                  >
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Receba Novidades por E-mail</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Assine nossa newsletter gratuita para receber os melhores artigos e notícias toda semana.
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu-email@exemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Assinar</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                Sem spam • Cancele quando quiser
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {currentYear} {siteName}. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 dark:text-slate-600">O seu portal definitivo de games e videogames.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
