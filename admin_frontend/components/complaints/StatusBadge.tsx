import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export type StatusType = "Pending Review" | "Open" | "Assigned" | "In Progress" | "Resolved";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case "Resolved": return "bg-[var(--color-priority-low)]/10 text-[var(--color-priority-low)] border-[var(--color-priority-low)]/20";
      case "In Progress": return "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20";
      case "Assigned": return "bg-[var(--color-priority-medium)]/10 text-[var(--color-priority-medium)] border-[var(--color-priority-medium)]/20";
      case "Open": return "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20";
      case "Pending Review": return "bg-[var(--color-priority-high)]/10 text-[var(--color-priority-high)] border-[var(--color-priority-high)]/20";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={cn(getColors(), className)}>
      {status}
    </Badge>
  );
}
