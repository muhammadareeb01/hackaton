"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/api";


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
    
    fetch(`${API_BASE_URL}/stats/`, {
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
      .catch(() => {
        // console.error(err);
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
          <StatCard title="Total Complaints" value={stats.total} icon={<FileText className="text-white w-6 h-6" />} trend="Live" theme="blue" />
          <StatCard title="Open Issues" value={stats.open_issues} icon={<AlertTriangle className="text-white w-6 h-6" />} trend="Pending" theme="orange" />
          <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 className="text-white w-6 h-6" />} trend="green" theme="green" />
          <StatCard title="Avg Resolution Time" value={stats.avg_resolution_time} icon={<Clock className="text-white w-6 h-6" />} trend="Estimated" theme="purple" />
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
                    <BarChart data={stats.category_data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        </linearGradient>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0EA5E9" floodOpacity="0.2" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }} 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                        itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                      />
                      <Bar dataKey="count" fill="url(#colorCount)" radius={[6, 6, 0, 0]} animationDuration={1500} filter="url(#shadow)" />
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
                      <defs>
                        <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
                        </filter>
                      </defs>
                      <Pie
                        data={stats.priority_data}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={120}
                        cornerRadius={8}
                        paddingAngle={6}
                        dataKey="value"
                        animationDuration={1500}
                        stroke="none"
                      >
                        {stats.priority_data.map((entry: PriorityData, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} filter="url(#pieShadow)" className="hover:opacity-80 transition-opacity duration-300 outline-none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                        itemStyle={{ fontWeight: 600 }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                        wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#475569' }} 
                      />
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
  theme?: 'blue' | 'orange' | 'green' | 'purple';
}

function StatCard({ title, value, icon, trend, theme = 'blue' }: StatCardProps) {
  const themes = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    orange: "from-orange-400 to-red-500 shadow-orange-500/20",
    green: "from-emerald-400 to-teal-500 shadow-emerald-500/20",
    purple: "from-purple-500 to-fuchsia-600 shadow-purple-500/20"
  };
  const bgClass = themes[theme];

  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgClass} shadow-lg hover:shadow-xl transition-all text-white border border-white/10`}>
        {/* Subtle background gradient blob */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white rounded-full blur-3xl opacity-10"></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</h3>
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">{icon}</div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-4xl font-black text-white tracking-tight">{value}</div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-white bg-black/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
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
