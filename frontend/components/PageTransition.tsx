"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Loader } from "./ui/Loader";

/**
 * PageTransition Component
 * 
 * Wraps page content in a framer-motion AnimatePresence to create smooth, 
 * professional fade-in and fade-out transitions during route changes in Next.js.
 * 
 * @param {React.ReactNode} children - The page content to be animated.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // No artificial delay needed anymore
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-grow flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
