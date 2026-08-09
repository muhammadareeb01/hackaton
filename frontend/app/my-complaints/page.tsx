"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, ClipboardList } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "@/lib/toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";
import { Chatbot } from "@/components/Chatbot";

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/complaints/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.status === 401) {
          Cookies.remove("user_token");
          router.push("/login");
          return;
        }
        
        if (!res.ok) throw new Error("Failed to load complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">
              My Complaints
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm sm:text-base max-w-2xl">
              Track the status of your reported issues, view AI-generated insights, and communicate with the city administration.
            </p>
          </div>
          <Link href="/report">
            <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white shadow-lg shadow-blue-500/20 rounded-full px-6 whitespace-nowrap group">
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              New Report
            </Button>
          </Link>
        </motion.div>

        {/* List of complaints */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-white border border-[var(--color-border)] shadow-sm animate-pulse p-6 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
                  <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                </div>
                <div className="w-full h-8 bg-gray-100 rounded-xl mt-auto"></div>
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[var(--color-border)] shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-[var(--color-primary)] opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No complaints yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
              You haven't reported any issues. Help keep our city running smoothly by reporting problems you encounter.
            </p>
            <Link href="/report">
              <Button variant="outline" className="rounded-full border-[var(--color-border)] hover:bg-gray-50">
                Create your first report
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {complaints.map((c, i) => (
                <motion.div 
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg border border-[var(--color-border)] flex flex-col relative overflow-hidden group transition-all h-[280px]"
                >
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${
                    c.status === "Pending Review" ? "bg-amber-400" :
                    c.status === "In Progress" ? "bg-blue-500" :
                    c.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{c.id}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-sm ${
                      c.status === "Pending Review" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      c.status === "In Progress" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      c.status === "Resolved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-700"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-[var(--color-text-primary)] mb-2 group-hover:text-blue-600 transition-colors">{c.category || "Uncategorized"}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 flex-1 leading-relaxed">{c.summary}</p>
                  
                  <div className="mt-auto flex justify-between items-center text-sm pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Reported On</span>
                      <span className="text-gray-700 font-medium">{new Date(c.date_submitted).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Priority</span>
                      <span className={`font-black ${
                        c.priority === "Critical" ? "text-red-600" :
                        c.priority === "High" ? "text-orange-500" :
                        c.priority === "Medium" ? "text-yellow-600" : "text-green-600"
                      }`}>{c.priority}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
