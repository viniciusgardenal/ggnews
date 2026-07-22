'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Category } from '@/lib/api';

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter();
  const articleId = Number(params.id);
  
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Populate categories and load current article values
    Promise.all([
      api.admin.getCategories(),
      api.admin.getArticle(articleId)
    ])
      .then(([fetchedCats, article]) => {
        setCategories(fetchedCats);
        
        // Populate inputs
        setTitle(article.title);
        setSlug(article.slug);
        setExcerpt(article.excerpt);
        setContent(article.content);
        setCategoryId(String(article.category_id));
        setStatus(article.status);
        setCoverImageUrl(article.cover_image || '');
        
        if (article.published_at) {
          const date = new Date(article.published_at);
          // Format ISO date to yyyy-MM-ddThh:mm for datetime-local inputs
          const formattedDate = date.toISOString().slice(0, 16);
          setPublishedAt(formattedDate);
        }
      })
      .catch((err) => setError(err.message || 'Erro ao carregar detalhes do artigo.'))
      .finally(() => setLoading(false));
  }, [articleId]);

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
    setSaving(true);

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
      await api.admin.updateArticle(articleId, payload);
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar artigo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 text-sm font-bold uppercase tracking-widest">
        Carregando detalhes do artigo...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
        <Link href="/admin/articles" className="hover:text-[var(--accent)] transition-colors">Artigos</Link>
        <span>/</span>
        <span className="text-slate-400">Editar Notícia</span>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-zinc-900 dark:text-white tracking-wider">Editar Notícia</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 text-sm text-rose-700 dark:text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-6 shadow-sm">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Slug da URL</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Resumo (Excerpt)</label>
              <textarea
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">Conteúdo do Artigo (Rich HTML/Markdown)</label>
                
                {/* Quick Helper Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setContent((prev) => prev + '\n<h2>Subtítulo Aqui</h2>\n')}
                    className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold"
                    title="Inserir Subtítulo"
                  >
                    + H2
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent((prev) => prev + '\n<p>Texto do seu parágrafo aqui...</p>\n')}
                    className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold"
                    title="Inserir Parágrafo"
                  >
                    + Parágrafo
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent((prev) => prev + '\n<blockquote>"Sua citação marcante aqui"</blockquote>\n')}
                    className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold"
                    title="Inserir Citação"
                  >
                    + Citação
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('URL do Vídeo do YouTube (ex: https://www.youtube.com/watch?v=VIDEO_ID):');
                      if (url) {
                        const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
                        setContent((prev) => prev + `\n<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" title="Vídeo YouTube" frameborder="0" allowfullscreen></iframe></div>\n`);
                      }
                    }}
                    className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-200"
                    title="Inserir Vídeo do YouTube"
                  >
                    + Vídeo YouTube
                  </button>
                </div>
              </div>

              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white font-mono focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] p-6 space-y-6 shadow-sm">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Status de Publicação</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            {/* Date scheduling */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Agendar Publicação</label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none"
              />
            </div>

            {/* Cover image uploader */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">Imagem de Capa</label>
              
              {coverImageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 mb-3">
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
                className="w-full py-3 border border-dashed border-zinc-200 dark:border-zinc-700 hover:border-[#66fcf1] hover:text-[#66fcf1] rounded text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {uploading ? 'Enviando Imagem...' : 'Alterar Imagem'}
              </label>

              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Ou digite a URL da imagem de capa..."
                className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-[10px] text-zinc-900 dark:text-white focus:border-[#66fcf1] focus:outline-none mt-3"
              />
            </div>

            {/* Actions Submit */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#ea580c] dark:bg-[#ff8838] hover:bg-[#c2410c] dark:hover:bg-[#e06818] rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <Link
                href="/admin/articles"
                className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 hover:border-zinc-350 dark:hover:border-zinc-650 rounded transition-colors text-center"
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
