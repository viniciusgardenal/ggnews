'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Category } from '@/lib/api';
import { 
  FileText, 
  Terminal, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Heading, 
  Quote, 
  Type, 
  Save, 
  X, 
  Loader2,
  ChevronRight 
} from 'lucide-react';

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
    api.admin.getCategories()
      .then((res) => {
        setCategories(res);
        if (res.length > 0) setCategoryId(String(res[0].id));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
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
      setError(err.message || 'Erro ao carregar arquivo de imagem.');
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
      setError(err.message || 'Erro ao registrar nova matéria no sistema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/admin/articles" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">ARTIGOS</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
        <span className="text-cyan-600 dark:text-cyan-400">NOVO ARTIGO</span>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>EDITOR DE CONTEÚDO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white font-mono tracking-tight">
            Criar Novo Artigo
          </h1>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 p-4 text-xs font-mono text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl backdrop-blur-md">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Título do Artigo
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-sans focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Ex: Novo Motor Gráfico Desbloqueia Fotorrealismo em Tempo Real"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Slug da URL (Identificador Único)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-xs font-mono text-cyan-700 dark:text-cyan-300 placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="novo-motor-grafico-fotorrealismo"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Resumo do Artigo
              </label>
              <textarea
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 font-sans focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Breve resumo da matéria que será exibido nos cards e na página inicial..."
              />
            </div>

            {/* Content Toolbar and Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Corpo do Artigo (Markup / HTML Suportado)
                </label>
                
                {/* Fast Injection Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setContent((prev) => prev + '\n<h2>Subtítulo de Seção</h2>\n')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <Heading className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>+ H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent((prev) => prev + '\n<p>Insira a descrição detalhada aqui...</p>\n')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <Type className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>+ Parágrafo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent((prev) => prev + '\n<blockquote>"Declaração verificada em destaque"</blockquote>\n')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <Quote className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>+ Citação</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('URL do Vídeo do YouTube (ex: https://www.youtube.com/watch?v=VIDEO_ID):');
                      if (url) {
                        const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
                        setContent((prev) => prev + `\n<div class="video-container my-6 rounded-xl overflow-hidden border border-cyan-500/20"><iframe src="https://www.youtube.com/embed/${videoId}" class="w-full aspect-video" title="Vídeo Incorporado" frameborder="0" allowfullscreen></iframe></div>\n`);
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 transition-colors"
                  >
                    <Video className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                    <span>+ Vídeo</span>
                  </button>
                </div>
              </div>

              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 font-mono focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="<h2>Subtítulo da Matéria</h2><p>Texto detalhado da matéria...</p>"
              />
            </div>

          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 p-6 space-y-6 shadow-sm dark:shadow-2xl backdrop-blur-md">
            
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-xs font-mono text-slate-900 dark:text-cyan-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            {/* Date scheduling */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Data e Horário de Publicação
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-3 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Cover image uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Imagem de Capa
              </label>
              
              {coverImageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-cyan-500/30 mb-3 bg-slate-100 dark:bg-black">
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
                className="w-full py-3.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50 dark:bg-black/40"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400" />
                    <span>ENVIANDO ARQUIVO...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>CARREGAR IMAGEM</span>
                  </>
                )}
              </label>

              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Ou cole a URL direta da imagem..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none mt-2"
              />
            </div>

            {/* Actions Submit */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white dark:text-black bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 rounded-xl transition-all shadow-md dark:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                    <span>SALVANDO...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white dark:text-black" />
                    <span>SALVAR ARTIGO</span>
                  </>
                )}
              </button>
              <Link
                href="/admin/articles"
                className="py-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl transition-colors text-center"
              >
                CANCELAR
              </Link>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
