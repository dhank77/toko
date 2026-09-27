import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-lg border border-[#CCCCCC] bg-[#F0F0F0] px-3 py-1.5 text-xs text-[#222222] shadow-xs transition-all outline-none",
        "placeholder:text-[#999999] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-medium",
        "focus:bg-white focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#D32F2F] aria-invalid:ring-2 aria-invalid:ring-[#D32F2F]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
