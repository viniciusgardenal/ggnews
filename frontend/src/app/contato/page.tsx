'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Mail, CheckCircle2, ChevronRight, MessageSquare, Clock } from 'lucide-react';

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
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 font-sans">
      
      {/* Header */}
      <header className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] space-y-4 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Contato</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-sm">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Fale Conosco</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 dark:text-white tracking-tight">
          Entre em Contato
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Tem alguma dúvida, sugestão de pauta, crítica ou proposta de parceria? Envie sua mensagem para a equipe do NEXUS.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center space-y-4 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                Mensagem Enviada com Sucesso!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Obrigado pelo contato, <strong>{name}</strong>. Responderemos para o e-mail <strong>{email}</strong> o mais rápido possível.
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
                className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                Enviar Outra Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-email@exemplo.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Assunto
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sugestão de pauta, dúvida, parceria..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Mensagem
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem detalhadamente..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14] p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Canais de Atendimento</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">E-mail da Redação</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">contato@nexus.com.br</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Tempo Médio de Resposta</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Em até 24 horas úteis</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
