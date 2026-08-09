import React from "react";
import { ShieldCheck, UserCog } from "lucide-react";

interface RoleBadgeProps {
  role: "superadmin" | "department_engineer" | "viewer";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getBadgeStyle = () => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "department_engineer":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getLabel = () => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "department_engineer":
        return "Dept. Engineer";
      default:
        return "Viewer";
    }
  };

  const Icon = role === "superadmin" ? ShieldCheck : UserCog;

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
      <Icon className="w-3 h-3 mr-1" />
      {getLabel()}
    </div>
  );
}
