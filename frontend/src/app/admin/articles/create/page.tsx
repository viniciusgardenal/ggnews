'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Category } from '@/lib/api';

export default function CreateArticlePage() {
  const router = useRouter();
  
  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // UI States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Populate categories
    api.admin.getCategories()
      .then((res) => {
        setCategories(res);
        if (res.length > 0) setCategoryId(String(res[0].id));
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle auto-slug creation reactive logic
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    // Convert to URL friendly slug
    const formattedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
    setSlug(formattedSlug);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);

    try {
      const res = await api.admin.uploadImage(files[0]);
      setCoverImageUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar imagem de capa.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      category_id: Number(categoryId),
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      cover_image: coverImageUrl || undefined,
    };

    try {
      await api.admin.createArticle(payload);
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar artigo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
        <Link href="/admin/articles" className="hover:text-[#66fcf1] transition-colors">Artigos</Link>
        <span>/</span>
        <span className="text-slate-400">Criar Novo</span>
      </div>

      <div className="flex items-center justify-between border-b border-[#1f2833]/20 pb-4">
        <h1 className="text-xl font-bold uppercase text-white tracking-wider">Nova Notícia</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-950/30 border border-rose-900/50 p-4 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0b0c10] p-6 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#66fcf1] focus:outline-none"
                placeholder="Ex: Novo Jogo de RPG é Revelado com Trailer de Gameplay"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Slug da URL</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#66fcf1] focus:outline-none"
                placeholder="novo-jogo-de-rpg-revelado"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Resumo (Excerpt)</label>
              <textarea
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#66fcf1] focus:outline-none"
                placeholder="Breve resumo da matéria que aparece na Home. Máximo 500 caracteres."
              />
            </div>

            {/* Content (Markup supported) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Conteúdo do Artigo (Rich HTML/Markdown)</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-sm text-white placeholder-slate-600 font-mono focus:border-[#66fcf1] focus:outline-none"
                placeholder="<h2>Subtítulo aqui</h2><p>Texto do parágrafo...</p>"
              />
              <span className="text-[10px] text-slate-500 block mt-2 uppercase tracking-wide">
                Suporta tags HTML como &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt; e &lt;iframe&gt; para vídeos do YouTube.
              </span>
            </div>

          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0b0c10] p-6 space-y-6">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Status de Publicação</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicar Imediatamente</option>
              </select>
            </div>

            {/* Date scheduling */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Agendar Publicação</label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-3 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            {/* Cover image uploader */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Imagem de Capa</label>
              
              {coverImageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded border border-[#1f2833] mb-3">
                  <img src={coverImageUrl} alt="Preview da capa" className="h-full w-full object-cover" />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cover-upload"
                disabled={uploading}
              />
              <label
                htmlFor="cover-upload"
                className="w-full py-3 border border-dashed border-[#1f2833] hover:border-[#66fcf1] hover:text-[#66fcf1] rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {uploading ? 'Enviando Imagem...' : 'Carregar Imagem'}
              </label>

              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Ou digite a URL da imagem de capa..."
                className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-2.5 text-[10px] text-white focus:border-[#66fcf1] focus:outline-none mt-3"
              />
            </div>

            {/* Actions Submit */}
            <div className="pt-4 border-t border-[#1f2833]/20 flex gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Salvando...' : 'Salvar Notícia'}
              </button>
              <Link
                href="/admin/articles"
                className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-[#1f2833] hover:border-slate-600 rounded transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
