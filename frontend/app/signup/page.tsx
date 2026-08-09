"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "@/lib/toast";
import Cookies from "js-cookie";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { API_BASE_URL } from "@/lib/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Verify email using backend AI Model before Firebase signup
      const verifyRes = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.allowed) {
        throw new Error(verifyData.reason || "This email address is not allowed.");
      }

      // 2. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optional: set display name
      await updateProfile(userCredential.user, { displayName: name });
      
      const token = await userCredential.user.getIdToken();
      
      // Store the Firebase token in cookies for Next.js routing/API usage
      Cookies.set("user_token", token, { expires: 7 });
      
      // Sync with SQL DB
      await fetch(`${API_BASE_URL}/auth/sync`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      toast.success("Account created! Welcome to SmartCity.");
      router.push("/my-complaints");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[var(--color-border)] p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]"></div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Create Account</h1>
          <p className="text-[var(--color-text-muted)]">Join SmartCity with Firebase Auth</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                placeholder="Areeb"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                placeholder="citizen@city.gov"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[var(--color-accent)]/90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
