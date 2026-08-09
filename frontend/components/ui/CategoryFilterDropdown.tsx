"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, Droplet, Zap, Navigation, Trash2, Leaf, ShieldAlert, MoreHorizontal } from "lucide-react";

interface CategoryFilterDropdownProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Layers className="w-4 h-4 text-blue-500" />,
  Water: <Droplet className="w-4 h-4 text-cyan-500" />,
  Electricity: <Zap className="w-4 h-4 text-yellow-500" />,
  Road: <Navigation className="w-4 h-4 text-emerald-500" />,
  Sanitation: <Trash2 className="w-4 h-4 text-orange-500" />,
  Environment: <Leaf className="w-4 h-4 text-green-500" />,
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
          className="inline-flex items-center justify-between w-56 rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#0EA5E9] hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
          id="category-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2.5">
            {getIcon(selectedCategory)}
            <span className="truncate">{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-2xl bg-white border border-gray-100 shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="category-menu-button"
          >
            <div className="py-1.5 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300" role="none">
              {allOptions.map((option) => {
                const isSelected = selectedCategory === option;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${
                      isSelected
                        ? "bg-[#0EA5E9]/10 text-[#0284c7] font-semibold"
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
