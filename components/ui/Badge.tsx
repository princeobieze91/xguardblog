import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "rose" | "green" | "gray" | "custom";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: string;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  primary: "badge-primary",
  rose:    "badge-rose",
  green:   "badge-green",
  gray:    "badge-gray",
  custom:  "badge",
};

export default function Badge({ children, variant = "gray", color, className }: BadgeProps) {
  return (
    <span
      className={cn(variantMap[variant], className)}
      style={color ? { backgroundColor: `${color}22`, color } : undefined}
    >
      {children}
    </span>
  );
}
