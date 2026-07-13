'use client';

import { useEffect, useState } from 'react';
import { api, Category } from '@/lib/api';

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
      .catch((err) => setError(err.message || 'Erro ao carregar categorias.'))
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
      alert(err.message || 'Erro ao criar categoria.');
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
      alert(err.message || 'Erro ao atualizar categoria.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir a categoria "${name}"? Todos os artigos associados serão afetados.`)) {
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
    <div className="space-y-8">
      
      <div>
        <h1 className="text-xl font-bold uppercase text-white tracking-wider">Gerenciador de Categorias</h1>
        <p className="text-xs text-slate-500 mt-1">Gerencie os tópicos principais e os links de navegação do cabeçalho.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Create form card */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0b0c10] p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Criar Nova Categoria</h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    // Autofill slug format reactive
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                  placeholder="Ex: Reviews"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full rounded border border-[#1f2833]/60 bg-[#0b0c10] px-4 py-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                  placeholder="reviews"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#66fcf1] hover:bg-[#45a29e] rounded transition-all disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Adicionar Categoria'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: List and edit table */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0b0c10] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#1f2833]/30">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Categorias Cadastradas</h3>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                Carregando...
              </div>
            ) : error ? (
              <div className="p-6 text-sm text-rose-400 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#1f2833]/20 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Nome da Categoria</th>
                      <th className="px-6 py-4">Slug da URL</th>
                      <th className="px-6 py-4">Artigos Associados</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2833]/20">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-900/10 transition-colors">
                        {editingId === cat.id ? (
                          // Editing mode inline
                          <td colSpan={4} className="px-6 py-4">
                            <form onSubmit={handleUpdateSubmit} className="flex flex-wrap items-center gap-3">
                              <input
                                type="text"
                                required
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded border border-[#1f2833]/60 bg-[#0b0c10] px-3 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                              />
                              <input
                                type="text"
                                required
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                                className="rounded border border-[#1f2833]/60 bg-[#0b0c10] px-3 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                              />
                              <button
                                type="submit"
                                disabled={updating}
                                className="px-3.5 py-1.5 rounded bg-[#66fcf1] text-black text-xs font-bold uppercase tracking-wider"
                              >
                                Salvar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-3.5 py-1.5 rounded border border-[#1f2833] text-xs font-bold uppercase tracking-wider hover:text-white"
                              >
                                Cancelar
                              </button>
                            </form>
                          </td>
                        ) : (
                          // Standard viewing row
                          <>
                            <td className="px-6 py-4 font-bold text-white">{cat.name}</td>
                            <td className="px-6 py-4 text-slate-400">/{cat.slug}</td>
                            <td className="px-6 py-4 text-slate-400">{cat.articles_count || 0}</td>
                            <td className="px-6 py-4 text-right space-x-3">
                              <button
                                onClick={() => handleEditClick(cat)}
                                className="text-xs font-bold text-[#66fcf1] hover:underline"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id, cat.name)}
                                className="text-xs font-bold text-rose-500 hover:underline"
                              >
                                Excluir
                              </button>
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
