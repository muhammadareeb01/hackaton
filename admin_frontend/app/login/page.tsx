"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "@/lib/toast";

import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      Cookies.set('token', data.access_token, { expires: 1/48 });
      toast.success("Welcome back, Administrator!");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.message === "Failed to fetch" || error.message.includes("Network")) {
        toast.error("Cannot connect to server. Is the backend running?");
      } else {
        toast.error("Invalid credentials or server error.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800"></div>
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-xl mx-auto flex items-center justify-center mb-5 border border-slate-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h1>
            <p className="text-slate-500 text-sm mb-4">Secure CitySync Administration</p>
            <div className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-lg p-3.5 text-left mb-6">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Demo Credentials</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm text-slate-600">
                <div className="flex-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Email Address</span>
                  <code className="font-mono text-xs text-slate-800 bg-white px-2.5 py-1.5 rounded border border-slate-200 block w-full truncate select-all">admin@citysync.gov</code>
                </div>
                <div className="flex-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Password</span>
                  <code className="font-mono text-xs text-slate-800 bg-white px-2.5 py-1.5 rounded border border-slate-200 block w-full truncate select-all">admin1234</code>
                </div>
              </div>
            </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                </div>
                <input 
                  required 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@citysync.gov" 
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all outline-none sm:text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                </div>
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 py-2.5 rounded-md border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Restricted Access Only</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
