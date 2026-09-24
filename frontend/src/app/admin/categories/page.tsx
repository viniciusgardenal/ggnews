'use client';

import { useEffect, useState } from 'react';
import { api, Category } from '@/lib/api';
import { 
  FolderTree, 
  FolderPlus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);

  // Form states for editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.admin.getCategories()
      .then((res) => setCategories(res))
      .catch((err) => setError(err.message || 'Erro ao sincronizar canais com o banco de dados.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setCreating(true);

    try {
      await api.admin.createCategory({
        name: newName,
        slug: newSlug || undefined
      });
      setNewName('');
      setNewSlug('');
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar novo canal.');
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editName || !editSlug) return;
    setUpdating(true);

    try {
      await api.admin.updateCategory(editingId, {
        name: editName,
        slug: editSlug
      });
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar canal.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir a categoria "${name}"? Os artigos associados serão afetados.`)) {
      return;
    }

    try {
      await api.admin.deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir categoria.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>GERENCIADOR DE CATEGORIAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white font-mono tracking-tight">
            Categorias
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Create form card */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 p-6 space-y-6 shadow-sm dark:shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                NOVA CATEGORIA
              </h3>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Ex: PlayStation"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Slug da Categoria (URL)
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-4 py-2.5 text-xs font-mono text-cyan-700 dark:text-cyan-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="playstation"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 text-xs font-mono font-bold uppercase tracking-widest text-white dark:text-black bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 rounded-xl transition-all shadow-md dark:shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                    <span>SALVANDO...</span>
                  </>
                ) : (
                  <span>ADICIONAR CATEGORIA</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: List and edit table */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#070b14]/90 overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-md">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-cyan-500/20 bg-slate-50/70 dark:bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  CATEGORIAS CADASTRADAS
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">{categories.length} CATEGORIAS</span>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400" />
                  <span>CARREGANDO CATEGORIAS...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-xs font-mono text-rose-500 dark:text-rose-400 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Slug da URL</th>
                      <th className="px-6 py-4">Artigos</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-cyan-500/5 transition-colors">
                        {editingId === cat.id ? (
                          // Editing mode inline
                          <td colSpan={4} className="px-6 py-4">
                            <form onSubmit={handleUpdateSubmit} className="flex flex-wrap items-center gap-3">
                              <input
                                type="text"
                                required
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
                              />
                              <input
                                type="text"
                                required
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/60 px-3 py-1.5 text-xs font-mono text-cyan-700 dark:text-cyan-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
                              />
                              <button
                                type="submit"
                                disabled={updating}
                                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider"
                              >
                                {updating ? 'Salvando...' : 'Salvar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              >
                                Cancelar
                              </button>
                            </form>
                          </td>
                        ) : (
                          // Standard viewing row
                          <>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                              <span>{cat.name}</span>
                            </td>
                            <td className="px-6 py-4 text-cyan-700 dark:text-cyan-400">/{cat.slug}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-[11px]">
                                {cat.articles_count || 0} artigos
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(cat)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-500/10 transition-colors"
                                  title="Editar Categoria"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(cat.id, cat.name)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                  title="Excluir Categoria"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
