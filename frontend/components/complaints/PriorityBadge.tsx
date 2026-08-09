import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getColors = () => {
    switch (priority) {
      case "Critical": return "bg-[var(--color-priority-critical)] hover:bg-[var(--color-priority-critical)]/90 text-white border-transparent";
      case "High": return "bg-[var(--color-priority-high)] hover:bg-[var(--color-priority-high)]/90 text-white border-transparent";
      case "Medium": return "bg-[var(--color-priority-medium)] hover:bg-[var(--color-priority-medium)]/90 text-white border-transparent";
      case "Low": return "bg-[var(--color-priority-low)] hover:bg-[var(--color-priority-low)]/90 text-white border-transparent";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent";
    }
  };

  return (
    <Badge className={cn(getColors(), className)}>
      {priority}
    </Badge>
  );
}
