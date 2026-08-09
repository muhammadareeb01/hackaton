"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut, ClipboardList, PlusCircle, Menu, X } from "lucide-react";

/**
 * Navbar Component
 * 
 * The main sticky navigation bar for the citizen-facing application.
 * Handles Firebase authentication state, mobile responsive hamburger menus, 
 * and dynamic routing (Login vs. Dashboard).
 */
export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!Cookies.get("user_token"));
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        user.getIdToken().then((token) => Cookies.set("user_token", token, { expires: 7 }));
      } else {
        setIsLoggedIn(false);
        Cookies.remove("user_token");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("user_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center w-full px-4 sm:px-6 pointer-events-none">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-400 rounded-2xl ${
          scrolled
            ? "bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-[rgba(0,0,0,0.07)]"
            : "bg-white/75 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.05)]"
        }`}
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div className="px-4 sm:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-1 cursor-pointer group">
              <span
                className="text-2xl font-normal text-gray-900 group-hover:text-[#0EA5E9] transition-colors duration-300 font-logo"
                style={{ fontStyle: "italic", letterSpacing: "0.02em" }}
              >
                Smart<span className="text-[#0EA5E9]" style={{ fontStyle: "italic", fontWeight: 600 }}>City</span>
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {["About Us", "Services"].map((label, i) => (
              <Link
                key={label}
                href={`/#${i === 0 ? "about" : "services"}`}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-300 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0EA5E9] transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[38px] bg-gray-100/80 animate-pulse rounded-xl" />
                <div className="w-[144px] h-[38px] bg-[#0EA5E9]/20 animate-pulse rounded-xl" />
              </div>
            ) : isLoggedIn ? (
              <>
                <Link href="/my-complaints">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all">
                    <ClipboardList className="w-4 h-4 text-[#0EA5E9]" />
                    My Complaints
                  </span>
                </Link>
                <Link href="/report">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn-primary text-[13px] sm:text-sm py-2 px-3 sm:px-5 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                  >
                    <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Report Complaint
                  </motion.button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-9 h-9 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-sm font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 transition-all">
                    Login
                  </span>
                </Link>
                <Link href="/report">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn-primary text-[13px] sm:text-sm py-2 px-3 sm:px-5 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                  >
                    <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Report Complaint
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:text-[#0EA5E9] bg-gray-50 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar / Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-auto flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-64 h-full bg-white shadow-2xl flex flex-col pt-20 px-6 gap-6"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col gap-4">
              <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-[#0EA5E9]">About Us</Link>
              <Link href="/#services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-[#0EA5E9]">Services</Link>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <div className="flex flex-col gap-3">
              {!mounted ? (
                <>
                  <div className="w-full h-[46px] bg-gray-100/80 animate-pulse rounded-xl" />
                  <div className="w-full h-[46px] bg-[#0EA5E9]/20 animate-pulse rounded-xl shadow-sm" />
                </>
              ) : isLoggedIn ? (
                <>
                  <Link href="/my-complaints" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                      <ClipboardList className="w-4 h-4 text-[#0EA5E9]" /> My Complaints
                    </div>
                  </Link>
                  <Link href="/report" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#0EA5E9] px-4 py-3 rounded-xl shadow-lg shadow-[#0EA5E9]/20">
                      <PlusCircle className="w-4 h-4" /> Report Complaint
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-sm font-medium text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl mt-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                      Login
                    </div>
                  </Link>
                  <Link href="/report" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#0EA5E9] px-4 py-3 rounded-xl shadow-lg shadow-[#0EA5E9]/20">
                      <PlusCircle className="w-4 h-4" /> Report Complaint
                    </div>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
