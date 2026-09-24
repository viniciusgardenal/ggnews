'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Clock } from 'lucide-react';

const NEWS_FEEDS = [
  { text: 'GTA VI: Confira os principais detalhes sobre o mapa de Vice City e os novos protagonistas', url: '/games/gta-6-gameplay-trailer-analise' },
  { text: 'PlayStation 5 Pro: Testamos os principais jogos com Ray Tracing e taxa estável a 60 FPS', url: '/playstation/ps5-pro-analise-desempenho-jogos' },
  { text: 'Nintendo Switch 2: Informações indicam retrocompatibilidade total e nova aventura de Mario', url: '/nintendo/nintendo-switch-2-jogos-e-detalhes' },
  { text: 'Xbox Game Pass: Confira os lançamentos de peso chegando ao catálogo este mês', url: '/xbox/xbox-game-pass-novidades-jogos' },
  { text: 'Projeto Orion: CD Projekt Red inicia produção da continuação de Cyberpunk 2077', url: '/pc-gaming/cyberpunk-orion-unreal-engine-detalhes' },
  { text: 'Black Myth Wukong: Review completo traz análise da jornada do Rei Macaco', url: '/reviews/black-myth-wukong-review-tecnica' },
];

export default function BreakingTicker() {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 mt-4 z-40 relative">
      <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-white dark:bg-[#060a14] border border-slate-200 dark:border-cyan-500/20 text-xs overflow-hidden shadow-sm">
        
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-400 text-black font-bold uppercase tracking-wider text-[11px] shadow-sm">
            <Zap className="w-3 h-3 text-black fill-black" />
            <span>ÚLTIMAS</span>
          </div>
        </div>

        {/* Marquee Feed */}
        <div className="relative flex-1 overflow-hidden h-5">
          <div className="absolute flex whitespace-nowrap animate-marquee gap-8 hover:[animation-play-state:paused] cursor-pointer">
            {NEWS_FEEDS.concat(NEWS_FEEDS).map((feed, idx) => (
              <Link 
                key={idx}
                href={feed.url}
                className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <span className="text-cyan-500">•</span>
                <span className="font-medium text-xs">{feed.text}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 shrink-0 border-l border-slate-200 dark:border-slate-800 pl-3">
          <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>{timeString || '12:00'}</span>
        </div>

      </div>
    </div>
  );
}
