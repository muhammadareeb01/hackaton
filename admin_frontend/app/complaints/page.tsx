"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle, X, Mail, Phone, MapPin, MoreVertical, Eye, Layers, Droplet, Zap, Navigation, Trash2, ShieldAlert, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { StatusBadge } from "@/components/complaints/StatusBadge";

import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { FilterDropdown, FilterDropdownOption } from "@/components/ui/FilterDropdown";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "Accept", value: "In Progress", icon: <Clock className="w-3.5 h-3.5" />, color: "text-blue-600 hover:bg-blue-50" },
  { label: "Resolve", value: "Resolved", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-green-600 hover:bg-green-50" },
  { label: "Reject", value: "Rejected", icon: <XCircle className="w-3.5 h-3.5" />, color: "text-red-600 hover:bg-red-50" },
  { label: "Escalate", value: "Escalated", icon: <AlertCircle className="w-3.5 h-3.5" />, color: "text-orange-600 hover:bg-orange-50" },
];

const STATUS_FILTER_OPTIONS: FilterDropdownOption[] = [
  { label: "All Statuses", value: "All", icon: <Layers className="w-4 h-4 text-blue-500" /> },
  { label: "Pending Review", value: "Pending Review", icon: <Clock className="w-4 h-4 text-amber-500" /> },
  { label: "In Progress", value: "In Progress", icon: <Clock className="w-4 h-4 text-blue-500" /> },
  { label: "Resolved", value: "Resolved", icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
  { label: "Rejected", value: "Rejected", icon: <XCircle className="w-4 h-4 text-red-500" /> },
  { label: "Escalated", value: "Escalated", icon: <AlertCircle className="w-4 h-4 text-orange-500" /> },
];

const PRIORITY_FILTER_OPTIONS: FilterDropdownOption[] = [
  { label: "All Priorities", value: "All", icon: <Layers className="w-4 h-4 text-blue-500" /> },
  { label: "Critical Priority", value: "Critical", icon: <span className="w-2 h-2 rounded-full bg-red-500" /> },
  { label: "High Priority", value: "High", icon: <span className="w-2 h-2 rounded-full bg-orange-500" /> },
  { label: "Medium Priority", value: "Medium", icon: <span className="w-2 h-2 rounded-full bg-yellow-500" /> },
  { label: "Low Priority", value: "Low", icon: <span className="w-2 h-2 rounded-full bg-green-500" /> },
];

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Layers className="w-4 h-4 text-blue-500" />,
  Water: <Droplet className="w-4 h-4 text-cyan-500" />,
  Drainage: <Droplet className="w-4 h-4 text-blue-600" />,
  Electricity: <Zap className="w-4 h-4 text-yellow-500" />,
  Road: <Navigation className="w-4 h-4 text-emerald-500" />,
  Waste: <Trash2 className="w-4 h-4 text-orange-500" />,
  Sanitation: <Trash2 className="w-4 h-4 text-orange-500" />,
  Safety: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  "Public Safety": <ShieldAlert className="w-4 h-4 text-rose-500" />,
  Other: <MoreHorizontal className="w-4 h-4 text-slate-500" />,
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} className="border-b border-[var(--color-border)]">
          {Array.from({ length: 8 }).map((_, j) => (
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
  description?: string;
  location?: string;
  citizen_email?: string;
  citizen_phone?: string;
  priority: PriorityLevel;
  status: StatusLevel;
  date_submitted: string;
  estimated_resolution_days?: number;
}

function ComplaintsListContent() {
  const searchParams = useSearchParams();
  const priorityParam = searchParams.get("priority");

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
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

  const getPaginationRange = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  useEffect(() => { setCurrentPage(1); }, [statusFilter, categoryFilter, priorityFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="p-8 w-full">
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
        <div className="flex flex-wrap gap-6 items-center mb-6">
          {/* Status Dropdown */}
          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
            onChange={setStatusFilter}
            widthClass="w-52"
          />

          {/* Category Dropdown */}
          {!loading && categories.length > 0 && (
            <FilterDropdown
              label="Category"
              value={categoryFilter}
              options={[
                { label: "All Categories", value: "All", icon: categoryIcons["All"] },
                ...categories.filter(c => c !== "All" && c !== "").map(c => ({
                  label: c,
                  value: c,
                  icon: categoryIcons[c] || categoryIcons["Other"]
                }))
              ]}
              onChange={setCategoryFilter}
              widthClass="w-52"
            />
          )}

          {/* Priority Dropdown */}
          {!loading && (
            <FilterDropdown
              label="Priority"
              value={priorityFilter}
              options={PRIORITY_FILTER_OPTIONS}
              onChange={setPriorityFilter}
              widthClass="w-52"
            />
          )}
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-[var(--color-text-primary)]">
              <thead className="bg-gray-50 text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-4">ID / Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Location</th>
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
                    <td colSpan={8} className="text-center py-16 text-[var(--color-text-muted)]">
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
                          {(complaint.citizen_email || complaint.citizen_phone) && (
                            <p className="text-[10px] text-slate-400 font-medium mt-1 select-all">
                              {complaint.citizen_email && <span>{complaint.citizen_email}</span>}
                              {complaint.citizen_email && complaint.citizen_phone && <span className="mx-1.5">|</span>}
                              {complaint.citizen_phone && <span>{complaint.citizen_phone}</span>}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="truncate text-[var(--color-text-muted)]" title={complaint.description}>{complaint.description}</p>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="truncate text-slate-500 font-medium" title={complaint.location}>{complaint.location}</p>
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
                              {/* Three dot actions trigger */}
                              <button
                                onClick={() => setOpenDropdown(openDropdown === complaint.id ? null : complaint.id)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center justify-center text-gray-500 hover:text-gray-800"
                              >
                                <MoreVertical className="w-4 h-4" />
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
                                    className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1 text-left"
                                  >
                                    {/* Action: View Details */}
                                    <button
                                      onClick={() => {
                                        setSelectedComplaint(complaint);
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-slate-50 transition-colors"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                                      View Details
                                    </button>

                                    <div className="border-t border-slate-100 my-1"></div>

                                    {/* Status Change Options */}
                                    <span className="block px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Update Status</span>
                                    {STATUS_OPTIONS.map(opt => (
                                      <button
                                        key={opt.value}
                                        onClick={() => {
                                          handleStatusChange(complaint.id, opt.value as StatusLevel);
                                          setOpenDropdown(null);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${opt.color}`}
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
                      {(complaint.citizen_email || complaint.citizen_phone) && (
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 select-all">
                          {complaint.citizen_email} | {complaint.citizen_phone}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                  
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">{complaint.description}</p>
                  
                  {complaint.location && (
                    <p className="text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 p-2 rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider mb-0.5">Location</span>
                      {complaint.location}
                    </p>
                  )}
                  
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
                {getPaginationRange().map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`dots-${idx}`} className="px-2 text-slate-400 font-bold select-none text-xs">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-[var(--color-primary)] text-white"
                          : "hover:bg-gray-200 text-[var(--color-text-muted)]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Complaint Details</span>
                  <h3 className="text-lg font-bold text-slate-800 mt-1">Ticket #{selectedComplaint.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto text-left">
                {/* Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Status</span>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Priority</span>
                    <PriorityBadge priority={selectedComplaint.priority} />
                  </div>
                </div>

                {/* Citizen Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citizen Information</h4>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {selectedComplaint.citizen_name?.[0] || 'A'}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Name</span>
                        <span className="text-sm font-semibold text-slate-800">{selectedComplaint.citizen_name || 'Anonymous'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-slate-100/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wide">Email</span>
                          <span className="text-xs font-medium text-slate-700 truncate block select-all" title={selectedComplaint.citizen_email}>{selectedComplaint.citizen_email || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wide">Phone</span>
                          <span className="text-xs font-medium text-slate-700 select-all">{selectedComplaint.citizen_phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location / Address</h4>
                  <div className="flex gap-2.5 items-start bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    <MapPin className="w-4.5 h-4.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 leading-relaxed">{selectedComplaint.location || 'N/A'}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complaint Description</h4>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl max-h-40 overflow-y-auto text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedComplaint.description}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Reported Date</span>
                    <span className="text-xs font-semibold text-slate-700">{new Date(selectedComplaint.date_submitted).toLocaleDateString("en-PK")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Est. Resolution</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {selectedComplaint.estimated_resolution_days ? `${selectedComplaint.estimated_resolution_days} Days` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors shadow-md"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComplaintsList() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    }>
      <ComplaintsListContent />
    </Suspense>
  );
}
