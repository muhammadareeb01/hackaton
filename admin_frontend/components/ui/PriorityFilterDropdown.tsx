"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

interface PriorityFilterDropdownProps {
  selectedPriority: string;
  onChange: (priority: string) => void;
}

const priorities = ["All", "Critical", "High", "Medium", "Low"];

const priorityDetails: Record<string, { label: string; dot: string; icon: React.ReactNode }> = {
  All: { label: "All Priorities", dot: "bg-slate-400", icon: <Sparkles className="w-3.5 h-3.5 text-slate-500" /> },
  Critical: { label: "Critical", dot: "bg-red-500", icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> },
  High: { label: "High", dot: "bg-orange-500", icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> },
  Medium: { label: "Medium", dot: "bg-yellow-500", icon: <AlertCircle className="w-3.5 h-3.5 text-yellow-600" /> },
  Low: { label: "Low", dot: "bg-green-500", icon: <AlertCircle className="w-3.5 h-3.5 text-green-500" /> },
};

export function PriorityFilterDropdown({
  selectedPriority,
  onChange,
}: PriorityFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const current = priorityDetails[selectedPriority] || priorityDetails["All"];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-44 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-[var(--color-primary)] hover:bg-gray-50/50 transition-all duration-200 focus:outline-none"
          id="priority-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${current.dot}`}></span>
            <span className="truncate">{current.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute left-0 z-50 mt-1.5 w-44 origin-top-left rounded-xl bg-white border border-gray-150 shadow-xl focus:outline-none overflow-hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="priority-menu-button"
          >
            <div className="py-1" role="none">
              {priorities.map((p) => {
                const isSelected = selectedPriority === p;
                const details = priorityDetails[p];
                return (
                  <button
                    key={p}
                    onClick={() => {
                      onChange(p);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors ${
                      isSelected
                        ? "bg-slate-50 text-slate-900 font-semibold border-l-2 border-[var(--color-primary)]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    role="menuitem"
                  >
                    <span className={`w-2 h-2 rounded-full ${details.dot}`}></span>
                    <span>{details.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
