import { cn } from "@/lib/utils";

// Let backend return anything — we will normalize
export interface StatusBadgeProps {
  status: string;       // <-- FIX: accepts ANY string
  className?: string;
}

// Keep your existing style map, but keys are lowercase
const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  under_review: {
    label: "Under Review",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  verified: {
    label: "Verified",
    className: "bg-success/10 text-success border-success/20",
  },
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  suspended: {
    label: "Suspended",
    className: "bg-muted text-muted-foreground border-border",
  },
};

// fallback style for unknown statuses
const fallbackConfig = {
  label: "Unknown",
  className: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status || "").toLowerCase().trim();

  const config =
    statusConfig[key] ??
    fallbackConfig; // fallback for unexpected backend strings

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
