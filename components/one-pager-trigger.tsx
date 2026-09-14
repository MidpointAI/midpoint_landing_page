"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnePagerOverlay } from "@/components/one-pager-overlay";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * A button that opens the one-pager overlay in place. Drop it anywhere the
 * site used to link to /one-pager; the page stays put and the sheet can be
 * dismissed.
 */
export function OnePagerTrigger({ children, onClick, ...props }: ButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        {...props}
        onClick={(e) => {
          onClick?.(e);
          setOpen(true);
        }}
      >
        {children}
      </Button>
      <OnePagerOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
