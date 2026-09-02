import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const button = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium " +
    "transition-colors duration-150 ease-mac " +
    "disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-press",
        tinted: "bg-primary/12 text-primary hover:bg-primary/18",
        ghost: "text-primary hover:bg-primary/10",
        neutral: "border border-border bg-surface text-foreground hover:bg-surface-2",
        danger: "bg-danger text-white hover:brightness-95",
      },
      size: {
        md: "h-8 px-3",
        sm: "h-[26px] px-2.5 text-[12px]",
        lg: "h-9 px-4 text-[13.5px]",
        icon: "size-8",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size, block }), className)} {...props} />
  ),
);
Button.displayName = "Button";
