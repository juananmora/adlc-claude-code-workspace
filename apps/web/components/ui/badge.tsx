import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // default: IRON DECK — blanco hueso sobre negro, mayúsculas.
        default:
          "border-[var(--iron-bone)] bg-transparent text-[var(--iron-bone)]",
        secondary:
          "border-stone-700 bg-stone-900 text-stone-300",
        destructive:
          "border-transparent bg-[var(--iron-red)] text-stone-100",
        outline: "border-stone-700 text-stone-300",
        success:
          "border-transparent bg-emerald-700 text-stone-100",
        warning:
          "border-transparent bg-amber-600 text-black",
        accent:
          "border-transparent bg-[var(--iron-red)] text-stone-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
