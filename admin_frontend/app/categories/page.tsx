"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Loader2, Tag, Search, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "@/lib/toast";
import Cookies from "js-cookie";

import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 8;

// Color palette cycling for category cards
const CARD_COLORS = [
  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-400" },
  { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-400" },
  { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-400" },
  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-400" },
  { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", dot: "bg-teal-400" },
  { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-400" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400" },
];

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-16 mt-auto" />
    </div>
  );
}

interface Category {
  id: number;
  name: string;
  created_at: string;
}

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
  const [newName, setNewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) { router.push("/login"); return; }
    fetchCategories();
  }, [router]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await apiClient("/categories/");
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);
    try {
      const data = await apiClient("/categories/", {
        method: "POST",
        body: JSON.stringify({ name: newName.trim() }),
      });
      setCategories(prev => [...prev, data]);
      setNewName("");
      toast.success(`Category "${data.name}" created!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const { id, name } = categoryToDelete;
    setDeletingId(id);
    setCategoryToDelete(null);
    try {
      await apiClient(`/categories/${id}`, { method: "DELETE" });
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success(`"${name}" deleted`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() =>
    categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [categories, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Category Management</h1>
              <p className="text-[var(--color-text-muted)] text-sm">
                {loading ? "Loading..." : `${categories.length} categories configured`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Create Form */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-lg border-0 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">New Category</h2>
                </div>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Category Name
                    </label>
                    <Input
                      required
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Noise Pollution"
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newName.trim()}
                    className="w-full h-11 font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Category
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-md bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white">
                  <CardContent className="p-5">
                    <p className="text-sm text-white/70 font-medium mb-1">Total Categories</p>
                    <p className="text-4xl font-black">{categories.length}</p>
                    <p className="text-xs text-white/60 mt-2">Available to citizens in complaint form</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right: Categories Grid */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Card className="overflow-hidden shadow-md">
              {/* Grid of category cards */}
              <div className="p-4">
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <CategoryCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-[var(--color-text-muted)] font-medium">No categories found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search or add a new one</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <AnimatePresence mode="popLayout">
                      {paginated.map((cat, i) => {
                        const color = CARD_COLORS[i % CARD_COLORS.length];
                        return (
                          <motion.div
                            key={cat.id}
                            layout
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.04 }}
                            className={`group relative rounded-2xl border ${color.bg} ${color.border} p-4 flex flex-col gap-2 hover:shadow-md transition-all cursor-default`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-xl ${color.dot} flex items-center justify-center shadow-sm`}>
                                <Tag className="w-4 h-4 text-white" />
                              </div>
                              <span className={`font-semibold text-sm ${color.text} leading-tight`}>{cat.name}</span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Added {new Date(cat.created_at).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })}
                            </p>
                            {/* Delete button (visible by default) */}
                            <button
                              onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                              disabled={deletingId === cat.id}
                              className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm border border-red-100"
                              title="Delete category"
                            >
                              {deletingId === cat.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden flex flex-col p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Trash2 className="w-5 h-5 text-rose-600 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Delete Category?</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-rose-600">"{categoryToDelete.name}"</span>? This action cannot be undone and will affect associated complaints.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
