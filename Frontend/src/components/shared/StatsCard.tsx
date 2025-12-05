import { LucideIcon, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}
const variantStyles = {
  default: "bg-card border border-border",
  primary: "bg-primary/10 border border-primary/20",
  secondary: "bg-secondary/10 border border-secondary/20",
  accent: "bg-accent/10 border border-accent/20"
};
const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground"
};
export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className
}: StatsCardProps) {
  return <div className={cn("rounded-xl p-6 transition-all hover:shadow-md", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          {trend && <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs last month</span>
            </div>}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", iconStyles[variant])}>
          <Heart className="w-6 h-6" />
        </div>
      </div>
    </div>;
}