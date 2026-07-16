'use client';

import { useEffect, useState } from 'react';
import { api, SiteSettings, FooterLink, SocialLink } from '@/lib/api';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Array Repeaters
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch global configs
    api.getSettings()
      .then((settings) => {
        setSiteName(settings.site_name);
        setSiteDescription(settings.site_description);
        setContactEmail(settings.contact_email || '');
        setLogoUrl(settings.logo_url || '');
        setFooterLinks(settings.footer_links || []);
        setSocialLinks(settings.social_links || []);
      })
      .catch((err) => setError(err.message || 'Erro ao carregar configurações.'))
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);

    try {
      const res = await api.admin.uploadImage(files[0]);
      setLogoUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar logo.');
    } finally {
      setUploading(false);
    }
  };

  // Footer Repeaters Helpers
  const addFooterLink = () => {
    setFooterLinks([...footerLinks, { title: '', url: '' }]);
  };

  const updateFooterLink = (index: number, field: keyof FooterLink, value: string) => {
    const list = footerLinks.map((link, idx) => {
      if (idx === index) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setFooterLinks(list);
  };

  const removeFooterLink = (index: number) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
  };

  // Social Repeaters Helpers
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const list = socialLinks.map((social, idx) => {
      if (idx === index) {
        return { ...social, [field]: value };
      }
      return social;
    });
    setSocialLinks(list);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const payload: SiteSettings = {
      site_name: siteName,
      site_description: siteDescription,
      logo_url: logoUrl || null,
      contact_email: contactEmail || null,
      footer_links: footerLinks,
      social_links: socialLinks
    };

    try {
      await api.admin.updateSettings(payload);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 text-sm font-bold uppercase tracking-widest">
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl font-bold uppercase text-zinc-900 dark:text-white tracking-wider">Configurações Gerais</h1>
        <p className="text-xs text-slate-500 mt-1">Ajuste a identidade visual, logo, redes sociais e rodapé do site.</p>
      </div>

      {success && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-4 text-sm text-emerald-700 dark:text-emerald-400">
          Configurações salvas e aplicadas com sucesso!
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 text-sm text-rose-700 dark:text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Identidade Visual */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-850 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">Identidade Visual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Nome do Site</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">E-mail de Contato</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Descrição do Portal (SEO)</label>
              <textarea
                required
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Logo do Site</label>
              {logoUrl && (
                <div className="mb-3 h-12 relative flex items-center">
                  <img src={logoUrl} alt="Logo preview" className="h-full object-contain bg-zinc-100 dark:bg-slate-900/60 p-2 rounded border border-zinc-200 dark:border-zinc-800" />
                </div>
              )}
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="logo-upload"
                  className="py-2.5 px-4 border border-dashed border-zinc-200 dark:border-zinc-700 hover:border-[#66fcf1] hover:text-[#66fcf1] rounded text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {uploading ? 'Enviando...' : 'Carregar Nova Logo'}
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="URL direta para a logo..."
                  className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer Link Repeater */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-850 dark:text-white">Links do Rodapé</h3>
            <button
              type="button"
              onClick={addFooterLink}
              className="text-xs font-bold uppercase tracking-wider text-[#66fcf1] hover:underline"
            >
              + Adicionar Link
            </button>
          </div>

          <div className="space-y-3">
            {footerLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  placeholder="Título do Link (ex: Sobre Nós)"
                  value={link.title}
                  onChange={(e) => updateFooterLink(idx, 'title', e.target.value)}
                  className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Caminho/URL (ex: /sobre)"
                  value={link.url}
                  onChange={(e) => updateFooterLink(idx, 'url', e.target.value)}
                  className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFooterLink(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-950/20 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-11.5 0M9 8.25v10.5m6-10.5v10.5M5.25 5.25h13.5" />
                  </svg>
                </button>
              </div>
            ))}
            {footerLinks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">Nenhum link adicionado ao rodapé.</p>
            )}
          </div>
        </section>

        {/* Social Link Repeater */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-850 dark:text-white">Canais e Redes Sociais</h3>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-xs font-bold uppercase tracking-wider text-[#66fcf1] hover:underline"
            >
              + Adicionar Rede
            </button>
          </div>

          <div className="space-y-3">
            {socialLinks.map((social, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  placeholder="Plataforma (ex: twitter, youtube)"
                  value={social.platform}
                  onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                  className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
                <input
                  type="url"
                  required
                  placeholder="URL Completa (ex: https://youtube.com/...)"
                  value={social.url}
                  onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                  className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-950/20 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-11.5 0M9 8.25v10.5m6-10.5v10.5M5.25 5.25h13.5" />
                  </svg>
                </button>
              </div>
            ))}
            {socialLinks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">Nenhuma rede social vinculada.</p>
            )}
          </div>
        </section>

        {/* Submit Bar */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#ea580c] dark:bg-[#ff8838] hover:bg-[#c2410c] dark:hover:bg-[#e06818] rounded transition-all disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

      </form>

    </div>
  );
}
