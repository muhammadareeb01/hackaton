"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FilterDropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  widthClass?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  widthClass = "w-48",
}: FilterDropdownProps) {
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

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)] font-semibold whitespace-nowrap">{label}:</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center justify-between ${widthClass} rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-[var(--color-primary)] hover:bg-gray-50/50 transition-all duration-200 focus:outline-none`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2 min-w-0">
            {selectedOption.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
            <span className="truncate text-left">{selectedOption.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-shrink-0 ml-1.5"
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
            className={`absolute left-[54px] z-50 mt-1.5 ${widthClass} origin-top-left rounded-xl bg-white border border-gray-150 shadow-xl focus:outline-none overflow-hidden`}
            role="menu"
          >
            <div className="py-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300" role="none">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors ${
                      isSelected
                        ? "bg-sky-50 text-sky-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    role="menuitem"
                  >
                    {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
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
