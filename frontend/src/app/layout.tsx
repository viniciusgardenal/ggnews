import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import FloatingLateralNav from '@/components/FloatingLateralNav';
import './globals.css';
import { api } from '@/lib/api';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await api.getSettings();
    const siteTitle = settings.site_name || 'NEXUS';
    const siteDesc = settings.site_description || 'Seu portal definitivo com as últimas notícias, análises de jogos, consoles e lançamentos do universo dos videogames.';
    
    return {
      title: {
        default: `${siteTitle} | O Seu Portal de Games e Videogames`,
        template: `%s | ${siteTitle}`,
      },
      description: siteDesc,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      openGraph: {
        type: 'website',
        locale: 'pt_BR',
        siteName: siteTitle,
        title: siteTitle,
        description: siteDesc,
      },
      twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteDesc,
      },
    };
  } catch (error) {
    return {
      title: 'NEXUS | O Seu Portal de Games e Videogames',
      description: 'Seu portal definitivo com as últimas notícias, análises de jogos, consoles e lançamentos do universo dos videogames.',
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: any[] = [];
  try {
    categories = await api.getCategories().catch(() => []);
  } catch (e) {
    categories = [];
  }

  return (
    <html 
      lang="pt-BR" 
      className={`${spaceGrotesk.variable} ${spaceMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nexus_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black relative md:pl-16 lg:pl-20 2xl:pl-0">
        
        {/* Ambient Glow Aura */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
        <div className="fixed bottom-1/4 right-10 w-[550px] h-[550px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[180px] pointer-events-none -z-10" />

        {/* Floating Modular Top Header */}
        <Header />

        {/* Breaking News Ticker */}
        <BreakingTicker />
        
        {/* Main Content */}
        <main className="flex-grow relative z-10">
          {children}
        </main>

        {/* Floating Lateral Navigation Menu */}
        <FloatingLateralNav categories={categories} />

        {/* Clean Footer */}
        <Footer />
      </body>
    </html>
  );
}
