"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut, ClipboardList } from "lucide-react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Force check cookie on every route change in case Firebase listener is delayed
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
    setIsLoggedIn(!!Cookies.get("user_token"));
  }, [pathname]);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // Ensure token is in cookies for SSR or API requests
        user.getIdToken().then(token => Cookies.set("user_token", token, { expires: 7 }));
      } else {
        setIsLoggedIn(false);
        Cookies.remove("user_token");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("user_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center w-full px-4 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-6xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition-all duration-300 rounded-3xl">
        <div className="px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group py-2 relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/60 group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-black text-lg italic">C</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight transition-all duration-300">
                City<span className="text-blue-400">Sync</span>
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link href="/#about" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors relative group">
              About Us
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/#services" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors relative group">
              Services
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full rounded-full"></span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            {(mounted && isLoggedIn) ? (
              <>
                <Link href="/my-complaints">
                  <span className="hidden sm:flex items-center gap-2 text-slate-200 font-bold text-sm bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors shadow-sm">
                    <ClipboardList className="w-4 h-4 text-blue-400" />
                    <span>My Complaints</span>
                  </span>
                </Link>
                <Link href="/report">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all text-sm flex items-center"
                  >
                    Report Issue
                  </motion.button>
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center w-9 h-9 bg-slate-800 text-slate-300 hover:bg-red-500 hover:text-white border border-slate-700 hover:border-red-500 rounded-xl transition-all shadow-sm" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block px-2">Login</span>
                </Link>
                <Link href="/signup">
                  <span className="text-sm font-bold bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-200 hover:bg-slate-700 hover:text-white transition-colors hidden sm:block shadow-sm">Sign up</span>
                </Link>
                <Link href="/report">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all text-sm flex items-center"
                  >
                    Report Issue
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
