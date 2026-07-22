'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Contato</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white tracking-wider">
          Fale <span className="text-[#ea580c] dark:text-[#ff8838]">Conosco</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Dúvidas, sugestões de pauta, parcerias ou anúncios? Mande uma mensagem para nossa equipe.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-8 text-center space-y-3 shadow-sm">
              <div className="text-3xl">✅</div>
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Mensagem Enviada com Sucesso!</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Obrigado pelo contato, {name}. Responderemos o mais breve possível no e-mail <strong>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Enviar Nova Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">E-mail de Contato</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">Assunto</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sugestão de Pauta, Anúncios, Dúvida..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">Mensagem</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem aqui..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#ea580c] dark:bg-[#ff8838] hover:bg-[#c2410c] dark:hover:bg-[#e06818] rounded-xl transition-all shadow-md"
              >
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">📧 E-mail Direto</h3>
            <p className="text-xs text-zinc-500">contato@coreloopnews.com</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">📍 Localização</h3>
            <p className="text-xs text-zinc-500">São Paulo, SP — Brasil</p>
          </div>
        </div>

      </div>

    </div>
  );
}
