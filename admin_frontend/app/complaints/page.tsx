"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { StatusBadge } from "@/components/complaints/StatusBadge";

import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { CategoryFilterDropdown } from "@/components/ui/CategoryFilterDropdown";
import { PriorityFilterDropdown } from "@/components/ui/PriorityFilterDropdown";
import { useSearchParams } from "next/navigation";




const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "Accept", value: "In Progress", icon: <Clock className="w-3.5 h-3.5" />, color: "text-blue-600 hover:bg-blue-50" },
  { label: "Resolve", value: "Resolved", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-green-600 hover:bg-green-50" },
  { label: "Reject", value: "Rejected", icon: <XCircle className="w-3.5 h-3.5" />, color: "text-red-600 hover:bg-red-50" },
  { label: "Escalate", value: "Escalated", icon: <AlertCircle className="w-3.5 h-3.5" />, color: "text-orange-600 hover:bg-orange-50" },
];

const STATUS_TABS = ["All", "Pending Review", "In Progress", "Resolved", "Rejected", "Escalated"];

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} className="border-b border-[var(--color-border)]">
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + (i * j % 3) * 15}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

type PriorityLevel = "Critical" | "High" | "Medium" | "Low";
type StatusLevel = "Pending Review" | "In Progress" | "Resolved" | "Rejected" | "Escalated";

interface Complaint {
  id: string;
  category: string;
  citizen_name?: string;
  summary?: string;
  priority: PriorityLevel;
  status: StatusLevel;
  date_submitted: string;
  estimated_resolution_days?: number;
}

export default function ComplaintsList() {
  const searchParams = useSearchParams();
  const priorityParam = searchParams.get("priority");

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync priority from query parameter
  useEffect(() => {
    if (priorityParam) {
      setPriorityFilter(priorityParam);
    }
  }, [priorityParam]);

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    apiClient("/complaints/")
      .then((data: Complaint[]) => {
        setComplaints(data);
        // Extract unique categories from complaints
        const uniqueCats = Array.from(new Set(data.map((c: Complaint) => c.category).filter(Boolean))).sort();
        setCategories(uniqueCats as string[]);
        setLoading(false);
      })
      .catch(() => {
        // console.error("Error fetching complaints", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);



  const handleStatusChange = async (complaintId: string, newStatus: StatusLevel) => {
    setUpdatingId(complaintId);
    setOpenDropdown(null);
    try {
      await apiClient(`/complaints/${complaintId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setComplaints(prev =>
        prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c)
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Combined Filter + Search
  const filteredData = complaints.filter(c => {
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      c.id?.toLowerCase().includes(q) ||
      c.citizen_name?.toLowerCase().includes(q) ||
      c.summary?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q);
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goToPage = (page: number) => setCurrentPage(Math.min(Math.max(1, page), totalPages));

  useEffect(() => { setCurrentPage(1); }, [statusFilter, categoryFilter, priorityFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">All Complaints</h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Manage and triage citizen reports.
              {!loading && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {filteredData.length} results
                </span>
              )}
            </p>
          </div>
          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search ID, name, category..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-5">
          {/* Status Tabs */}
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-[var(--color-text-muted)] font-semibold self-center mr-1">Status:</span>
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  statusFilter === tab
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          {!loading && categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">Category:</span>
              <CategoryFilterDropdown
                categories={categories}
                selectedCategory={categoryFilter}
                onChange={setCategoryFilter}
              />
            </div>
          )}

          {/* Priority Dropdown */}
          {!loading && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">Priority:</span>
              <PriorityFilterDropdown
                selectedPriority={priorityFilter}
                onChange={setPriorityFilter}
              />
            </div>
          )}
        </div>

        {/* Table */}
        <Card className="overflow-visible">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-visible">
            <table className="w-full text-left text-sm text-[var(--color-text-primary)]">
              <thead className="bg-gray-50 text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-4">ID / Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-[var(--color-text-muted)]">
                      <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p>No complaints found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginatedData.map((complaint, i) => (
                      <motion.tr
                        key={complaint.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-[var(--color-border)] hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-[var(--color-primary)]">{complaint.citizen_name || "Anonymous"}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">#{complaint.id}</p>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="truncate text-[var(--color-text-muted)]">{complaint.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium">{complaint.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <PriorityBadge priority={complaint.priority} />
                          {complaint.estimated_resolution_days && (
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-medium ml-1">
                              Est: <span className="font-bold text-gray-700">{complaint.estimated_resolution_days} days</span>
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                          {new Date(complaint.date_submitted).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {updatingId === complaint.id ? (
                            <Loader2 className="w-4 h-4 animate-spin ml-auto text-[var(--color-primary)]" />
                          ) : (
                            <div className="relative inline-block update-dropdown-container">
                              <button
                                onClick={() => setOpenDropdown(openDropdown === complaint.id ? null : complaint.id)}
                                className="text-xs font-semibold flex items-center gap-1 ml-auto transition-colors border border-[var(--color-border)] rounded-lg px-3 py-1.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-white text-[var(--color-accent)]"
                              >
                                <Filter className="w-3 h-3" />
                                Update
                              </button>
                              {openDropdown === complaint.id && (
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} />
                              )}
                              <AnimatePresence>
                                {openDropdown === complaint.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-1 w-40 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden"
                                  >
                                    {STATUS_OPTIONS.map(opt => (
                                      <button
                                        key={opt.value}
                                        onClick={() => handleStatusChange(complaint.id, opt.value as StatusLevel)}
                                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${opt.color}`}
                                      >
                                        {opt.icon}
                                        {opt.label}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {loading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-32"></div>
               ))
            ) : paginatedData.length === 0 ? (
               <div className="text-center py-12 text-[var(--color-text-muted)]">
                 <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                 <p>No complaints found matching your filters.</p>
               </div>
            ) : (
              paginatedData.map((complaint) => (
                <div key={complaint.id} className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[var(--color-primary)] text-sm">{complaint.citizen_name || "Anonymous"}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase">#{complaint.id}</p>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                  
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">{complaint.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700">{complaint.category}</span>
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Reported</span>
                       <span className="text-xs text-gray-700 font-medium">{new Date(complaint.date_submitted).toLocaleDateString("en-PK")}</span>
                    </div>
                    
                    {updatingId === complaint.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
                    ) : (
                      <div className="relative inline-block update-dropdown-container">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === complaint.id ? null : complaint.id)}
                          className="text-xs font-bold flex items-center gap-1.5 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[var(--color-primary)] bg-gray-50 text-[var(--color-accent)] shadow-sm"
                        >
                          <Filter className="w-3 h-3" />
                          Update
                        </button>
                        {openDropdown === complaint.id && (
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} />
                        )}
                        <AnimatePresence>
                          {openDropdown === complaint.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 bottom-full mb-2 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  onClick={() => handleStatusChange(complaint.id, opt.value as StatusLevel)}
                                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold transition-colors border-b border-gray-50 last:border-0 ${opt.color}`}
                                >
                                  {opt.icon}
                                  {opt.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredData.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] bg-gray-50/50">
              <p className="text-xs text-[var(--color-text-muted)]">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredData.length)} of {filteredData.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[var(--color-primary)] text-white"
                        : "hover:bg-gray-200 text-[var(--color-text-muted)]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
