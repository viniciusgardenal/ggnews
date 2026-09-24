'use client';

import { useState, useEffect } from 'react';
import { Share2, Check, Copy, MessageSquare } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#090d18] border border-cyan-500/20 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          RETRANSMITIR INTEL:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all"
        >
          <svg className="w-3.5 h-3.5 fill-cyan-400" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X / TWITTER</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 hover:border-emerald-400 text-xs font-mono text-emerald-300 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>WHATSAPP</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">LINK COPIADO</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>COPIAR LINK</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
