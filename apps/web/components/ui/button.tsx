import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // IRON DECK: CTA primario = rojo sangre relleno, mayúsculas.
        default:
          "bg-[var(--iron-red)] text-stone-100 uppercase tracking-[0.22em] hover:bg-[#8b0000]",
        destructive:
          "bg-[var(--iron-red)] text-stone-100 uppercase tracking-[0.22em] hover:bg-[#8b0000]",
        // Outline = borde blanco hueso sobre negro, hover invierte.
        outline:
          "border border-[var(--iron-bone)] bg-transparent text-[var(--iron-bone)] uppercase tracking-[0.22em] hover:bg-[var(--iron-bone)] hover:text-[#0a0a0a]",
        secondary:
          "bg-stone-900 text-stone-200 hover:bg-stone-800",
        ghost: "text-[var(--iron-bone)] hover:text-[var(--iron-red)]",
        link: "text-[var(--iron-bone)] underline-offset-4 hover:underline hover:text-[var(--iron-red)] decoration-[var(--iron-red)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
