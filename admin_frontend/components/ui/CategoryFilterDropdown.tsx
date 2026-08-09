"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, Droplet, Zap, Navigation, Trash2, ShieldAlert, MoreHorizontal } from "lucide-react";

interface CategoryFilterDropdownProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Layers className="w-4 h-4 text-blue-500" />,
  Water: <Droplet className="w-4 h-4 text-cyan-500" />,
  Drainage: <Droplet className="w-4 h-4 text-blue-600" />,
  Electricity: <Zap className="w-4 h-4 text-yellow-500" />,
  Road: <Navigation className="w-4 h-4 text-emerald-500" />,
  Waste: <Trash2 className="w-4 h-4 text-orange-500" />,
  Sanitation: <Trash2 className="w-4 h-4 text-orange-500" />,
  Safety: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  "Public Safety": <ShieldAlert className="w-4 h-4 text-rose-500" />,
  Other: <MoreHorizontal className="w-4 h-4 text-slate-500" />,
};

export function CategoryFilterDropdown({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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

  const allOptions = ["All", ...categories.filter((c) => c !== "All" && c !== "")];

  const getIcon = (cat: string) => {
    return categoryIcons[cat] || categoryIcons["Other"];
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-52 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-[var(--color-primary)] hover:bg-gray-50/50 transition-all duration-200 focus:outline-none"
          id="category-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2">
            {getIcon(selectedCategory)}
            <span className="truncate">{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
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
            className="absolute left-0 z-50 mt-1.5 w-52 origin-top-left rounded-xl bg-white border border-gray-150 shadow-xl focus:outline-none overflow-hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="category-menu-button"
          >
            <div className="py-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300" role="none">
              {allOptions.map((option) => {
                const isSelected = selectedCategory === option;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors ${
                      isSelected
                        ? "bg-sky-50 text-sky-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    role="menuitem"
                  >
                    <span className="flex-shrink-0">{getIcon(option)}</span>
                    <span className="truncate">{option === "All" ? "All Categories" : option}</span>
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
