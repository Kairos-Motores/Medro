import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] font-semibold " +
    "transition-[transform,background-color] duration-200 ease-ios active:scale-[.98] " +
    "disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-press",
        tinted: "bg-primary/12 text-primary hover:bg-primary/18",
        ghost: "text-primary hover:bg-primary/10",
        neutral: "bg-surface text-foreground border border-border hover:bg-surface-muted",
        danger: "bg-danger text-white hover:brightness-95",
      },
      size: {
        md: "min-h-tap px-4 py-2.5",
        sm: "h-9 px-3 text-[13px]",
        lg: "min-h-[52px] px-5 text-base",
        icon: "size-11",
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
