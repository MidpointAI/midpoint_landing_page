import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * The one button for the site. Pill-shaped to match the navbar and hero,
 * coloured entirely from theme tokens. Use `asChild` to render a Link or
 * anchor with button styling.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-border bg-transparent text-foreground hover:border-border-hover hover:bg-secondary/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        xs: "h-7 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3.5 text-sm",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-9",
      },
    },
    compoundVariants: [
      // Text links keep their natural line height and no pill padding.
      { variant: "link", class: "h-auto rounded-none px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
