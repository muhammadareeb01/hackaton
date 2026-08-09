"use client";

import { useState, useEffect, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Plus, ClipboardList, Flame, AlertTriangle,
  CheckCircle2, Clock, Activity, Brain, TrendingUp, Zap
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "@/lib/toast";
import Link from "next/link";
import { Loader } from "@/components/ui/Loader";

const priorityConfig: Record<string, { badge: string; label: string; icon: ReactElement }> = {
  Critical: { badge: "badge-critical", label: "Critical", icon: <Flame className="w-3.5 h-3.5" /> },
  High:     { badge: "badge-high",     label: "High",     icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  Medium:   { badge: "badge-medium",   label: "Medium",   icon: <Activity className="w-3.5 h-3.5" /> },
  Low:      { badge: "badge-low",      label: "Low",      icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
};

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  "Pending Review": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  "In Progress":    { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  "Resolved":       { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  "Rejected":       { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
};

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = Cookies.get("user_token");
      if (!token) {
        toast.error("Please login to view your complaints");
        router.push("/login");
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiUrl}/complaints/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { Cookies.remove("user_token"); router.push("/login"); return; }
        if (!res.ok) throw new Error("Failed to load complaints");
        setComplaints(await res.json());
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [router]);

  // Stats derived from complaints
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const critical = complaints.filter((c) => c.priority === "Critical").length;

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb-cyan absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-20" />
        <div className="orb-purple absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-15" />
        <div className="grid-dots absolute inset-0" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-gray-200"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
              <Brain className="w-3.5 h-3.5" />
              AI-Tracked Complaints
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              My Complaints
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl">
              Track the status of your reported issues, view AI-generated insights, and communicate with city administration.
            </p>
          </div>
          <Link href="/report">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Report
            </motion.button>
          </Link>
        </motion.div>

        {/* Bento Stats Grid */}
        {!loading && complaints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[
                { label: "Total Reports", value: total, icon: <ClipboardList className="w-4 h-4" />, color: "text-gray-600", bg: "bg-gray-100" },
                { label: "Resolved", value: resolved, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-50" },
                { label: "In Progress", value: inProgress, icon: <TrendingUp className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Critical", value: critical, icon: <Flame className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <div key={i} className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Complaints Grid */}
        {loading ? (
          <div className="py-20 flex justify-center w-full">
            <Loader />
          </div>
        ) : complaints.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
              <ClipboardList className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
              You haven't reported any issues. Help keep our city running smoothly by reporting problems you encounter.
            </p>
            <Link href="/report">
              <button className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Create your first report
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {complaints.map((c, i) => {
                const pCfg = priorityConfig[c.priority] || priorityConfig["Low"];
                const sCfg = statusConfig[c.status] || statusConfig["Pending Review"];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-6 flex flex-col relative overflow-hidden group h-[280px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:-translate-y-1 hover:border-[#0EA5E9]/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-0"></div>
                    <div className="relative z-10 flex flex-col h-full">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{c.id.substring(0, 8)}</span>
                      {/* Status badge */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 border ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}
                      >
                        <Clock className="w-3 h-3" />
                        {c.status}
                      </span>
                    </div>

                    {/* Category */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                      {c.category || "Uncategorized"}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 flex-1 leading-relaxed">{c.summary}</p>

                    {/* Footer */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-200/60">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase tracking-wider mb-0.5 font-semibold">Reported</span>
                        <span className="text-sm text-gray-900 font-bold">{new Date(c.date_submitted).toLocaleDateString()}</span>
                      </div>
                      {/* AI Priority Badge */}
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm ${pCfg.badge}`}>
                        {pCfg.icon}
                        {pCfg.label}
                      </span>
                    </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
