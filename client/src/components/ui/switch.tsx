import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600 focus-visible:border-blue-500 focus-visible:ring-blue-500/50 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 relative z-10",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:bg-slate-200 pointer-events-none block size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5 shadow-md",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
