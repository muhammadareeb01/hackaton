import Link from "next/link";
import { ArrowUpRight, Code, Mail, MessageCircle, ArrowRight } from "lucide-react";

const LinkedinIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#0B1220] relative overflow-hidden border-t border-[#111C2E]">
      
      {/* Abstract Civic Background Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="city-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              <rect x="15" y="15" width="10" height="30" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              <rect x="40" y="30" width="10" height="15" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#city-grid)" />
          {/* Subtle gradient to fade out the top/bottom */}
          <rect width="100%" height="100%" fill="url(#fade)" />
          <defs>
            <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1220" stopOpacity="1" />
              <stop offset="50%" stopColor="#0B1220" stopOpacity="0" />
              <stop offset="100%" stopColor="#0B1220" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top CTA Strip */}
        <div className="px-6 py-8 md:py-10 border-b border-[#111C2E] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">See something that needs fixing?</h3>
            <p className="text-[#8792A5] text-sm md:text-base">Report it and help make your neighborhood better.</p>
          </div>
          <Link href="/report">
            <button className="bg-[#08A8E8] hover:bg-[#0284c7] text-white px-7 py-3.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group whitespace-nowrap shadow-sm">
              Report an Issue 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Main Footer Columns */}
        <div className="px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Left Column: Brand & Mission */}
          <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-12">
            <Link href="/" className="mb-6 inline-block">
              <span className="text-3xl font-normal text-white font-serif tracking-tight">
                Smart<span className="text-[#08A8E8] font-bold font-sans">City</span>
              </span>
            </Link>
            <h4 className="text-white font-medium mb-3 text-lg">Built for the people who live here.</h4>
            <p className="text-[#8792A5] leading-relaxed mb-6 text-sm">
              A civic platform that gives every citizen a direct line to the services that keep their city moving.
            </p>
            <div className="flex items-center gap-2.5 bg-[#111C2E]/50 border border-[#111C2E] px-4 py-2 rounded-full">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35C98A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#35C98A]"></span>
              </div>
              <span className="text-xs font-semibold text-[#8792A5] uppercase tracking-wider">City services online</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/#about" },
                { label: "Services", href: "/#services" },
                { label: "How It Works", href: "/#services" },
                { label: "My Complaints", href: "/my-complaints" },
                { label: "Report an Issue", href: "/report" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#8792A5] hover:text-white transition-all text-sm flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
            <ul className="space-y-3">
              {[
                { label: "Contact", icon: Mail, href: "mailto:syedareebali795@gmail.com" },
                { label: "LinkedIn", icon: LinkedinIcon, href: "https://www.linkedin.com/in/muhammad-areeb-7061a4225/" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-[#8792A5] hover:text-white transition-colors text-sm flex items-center gap-2.5 group">
                    <link.icon className="w-4 h-4 text-[#8792A5] group-hover:text-white transition-colors" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-6 border-t border-[#111C2E] flex flex-col items-center justify-center text-center">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-[#8792A5]">© 2026 SmartCity.</p>
            <span className="hidden md:inline text-[#111C2E]">•</span>
            <p className="text-sm text-[#8792A5]">Built for better neighborhoods.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
