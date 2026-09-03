import * as React from "react";
import * as Pop from "@radix-ui/react-popover";
import { cn } from "@/lib/cn";

export const Popover = Pop.Root;
export const PopoverTrigger = Pop.Trigger;
export const PopoverAnchor = Pop.Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof Pop.Content>,
  React.ComponentPropsWithoutRef<typeof Pop.Content>
>(({ className, align = "start", sideOffset = 6, ...props }, ref) => (
  <Pop.Portal>
    <Pop.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "material-menu z-50 rounded-lg border border-border p-2 text-foreground shadow-popover outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  </Pop.Portal>
));
PopoverContent.displayName = "PopoverContent";
