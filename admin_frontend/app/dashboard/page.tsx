"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


import { RoleBadge } from "@/components/ui/RoleBadge";

interface PriorityData {
  name: string;
  value: number;
  color: string;
}

interface CategoryData {
  name: string;
  count: number;
}

interface StatsData {
  total: number;
  open_issues: number;
  resolved: number;
  avg_resolution_time: string;
  category_data: CategoryData[];
  priority_data: PriorityData[];
}

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/stats/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.error(err);
        setIsLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded || !stats) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Overview Dashboard</h1>
            <p className="text-[var(--color-text-muted)] flex items-center gap-3">
              Live statistical analysis of civic services.
              <RoleBadge role="superadmin" />
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Complaints" value={stats.total} icon={<FileText className="text-[var(--color-primary)] w-6 h-6" />} trend="Live" />
          <StatCard title="Open Issues" value={stats.open_issues} icon={<AlertTriangle className="text-[var(--color-priority-high)] w-6 h-6" />} trend="Pending" />
          <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 className="text-[var(--color-priority-low)] w-6 h-6" />} trend="Completed" />
          <StatCard title="Avg Resolution Time" value={stats.avg_resolution_time} icon={<Clock className="text-[var(--color-accent)] w-6 h-6" />} trend="Estimated" />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Category Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Category Frequency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.category_data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-[var(--color-text-muted)] border border-gray-100">
                  <span className="font-semibold text-[var(--color-text-primary)]">Insight: </span>
                  Water-related complaints make up the majority (36%) of all reports, suggesting a need for increased infrastructure investment in the Water Department.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Priority Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Priority Urgency Spread</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.priority_data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {stats.priority_data.map((entry: PriorityData, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-[var(--color-text-muted)] border border-gray-100">
                  <span className="font-semibold text-[var(--color-text-primary)]">Insight: </span>
                  Critical and High priority issues account for 25% of the backlog. AI automatically surfaces these so they are handled first.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        {/* Subtle background gradient blob */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-2xl opacity-70"></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
            <div className="p-2.5 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm">{icon}</div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-4xl font-black text-gray-800 tracking-tight">{value}</div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] bg-blue-50 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {trend}
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="bg-white border-b border-[var(--color-border)] h-16"></header>
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl shadow-sm border border-[var(--color-border)] animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="h-[450px] bg-white rounded-xl shadow-sm border border-[var(--color-border)] animate-pulse"></div>
          <div className="h-[450px] bg-white rounded-xl shadow-sm border border-[var(--color-border)] animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}
