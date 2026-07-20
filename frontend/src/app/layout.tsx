import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

// Fetch settings once at the layout level to inject global SEO details
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await api.getSettings();
    return {
      title: {
        default: settings.site_name,
        template: `%s | ${settings.site_name}`,
      },
      description: settings.site_description,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      openGraph: {
        type: 'website',
        locale: 'pt_BR',
        siteName: settings.site_name,
        title: settings.site_name,
        description: settings.site_description,
      },
    };
  } catch (error) {
    console.error('Failed to generate page metadata:', error);
    return {
      title: 'Core Loop News | Portal de Games',
      description: 'O seu portal definitivo de notícias gamer.',
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${spaceMono.variable} darkScroll`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
