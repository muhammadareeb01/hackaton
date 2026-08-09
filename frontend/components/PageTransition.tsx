"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "./ui/Loader";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsNavigating(true);
      setCurrentPath(pathname);
      
      // Simulate network request or page load delay for a smooth visual transition
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [pathname, currentPath]);

  return (
    <AnimatePresence mode="wait">
      {isNavigating ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Custom Modern Ring Loader */}
            <div className="w-16 h-16 relative mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#08A8E8] border-t-transparent animate-spin"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#08A8E8] font-bold tracking-widest uppercase text-sm"
            >
              Loading...
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-grow flex flex-col"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
