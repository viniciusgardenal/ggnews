'use client';

import { useEffect, useState } from 'react';
import { api, SiteSettings, FooterLink, SocialLink } from '@/lib/api';
import { 
  Sliders, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  Globe, 
  Share2, 
  Terminal,
  ShieldCheck
} from 'lucide-react';

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
    api.getSettings()
      .then((settings) => {
        setSiteName(settings.site_name);
        setSiteDescription(settings.site_description);
        setContactEmail(settings.contact_email || '');
        setLogoUrl(settings.logo_url || '');
        setFooterLinks(settings.footer_links || []);
        setSocialLinks(settings.social_links || []);
      })
      .catch((err) => setError(err.message || 'Erro ao carregar configurações do site.'))
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
      setError(err.message || 'Erro ao enviar logotipo.');
    } finally {
      setUploading(false);
    }
  };

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
      setError(err.message || 'Erro ao persistir configurações no banco de dados.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-600 dark:text-cyan-400" />
          <span>CARREGANDO CONFIGURAÇÕES...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>CONFIGURAÇÕES DO PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white font-mono tracking-tight">
            Configurações Gerais
          </h1>
        </div>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 p-4 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>CONFIGURAÇÕES ATUALIZADAS COM SUCESSO!</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 p-4 text-xs font-mono text-rose-800 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Identidade Visual */}
        <section className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-cyan-500/20 pb-3">
            <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              IDENTIDADE VISUAL E SEO
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Nome do Site
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                E-mail de Contato Principal
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Descrição do Portal (Meta Tags & SEO)
              </label>
              <textarea
                required
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Logotipo do Site
              </label>
              {logoUrl && (
                <div className="mb-3 h-12 flex items-center">
                  <img src={logoUrl} alt="Logo preview" className="h-full object-contain bg-slate-100 dark:bg-black/60 p-2 rounded-lg border border-slate-300 dark:border-slate-700" />
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
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 bg-slate-100 dark:bg-white/5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{uploading ? 'ENVIANDO...' : 'CARREGAR NOVO LOGOTIPO'}</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Links do Rodapé */}
        <section className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                LINKS DO RODAPÉ
              </h3>
            </div>
            <button
              type="button"
              onClick={addFooterLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-mono font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADICIONAR LINK</span>
            </button>
          </div>

          <div className="space-y-3">
            {footerLinks.map((link, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Título (ex: Sobre Nós)"
                  value={link.title}
                  onChange={(e) => updateFooterLink(idx, 'title', e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="URL (ex: /sobre)"
                  value={link.url}
                  onChange={(e) => updateFooterLink(idx, 'url', e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2 text-xs font-mono text-cyan-700 dark:text-cyan-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFooterLink(idx)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Redes Sociais */}
        <section className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                REDES SOCIAIS
              </h3>
            </div>
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-mono font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADICIONAR REDE</span>
            </button>
          </div>

          <div className="space-y-3">
            {socialLinks.map((social, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Plataforma (ex: twitter, discord, youtube)"
                  value={social.platform}
                  onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                  className="w-1/3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="URL Completa (ex: https://x.com/nexuswire)"
                  value={social.url}
                  onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2 text-xs font-mono text-cyan-700 dark:text-cyan-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black font-mono font-bold text-xs uppercase tracking-wider shadow-md dark:shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:opacity-50 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                <span>SALVANDO CONFIGURAÇÕES...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white dark:text-black" />
                <span>SALVAR ALTERAÇÕES</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
