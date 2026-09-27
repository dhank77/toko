import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#0099FF] text-white border-transparent",
        orange:
          "bg-[#FF6000] text-white border-transparent",
        discount:
          "bg-[#D32F2F] text-white border-transparent font-bold",
        navy:
          "bg-[#166397] text-white border-transparent",
        destructive:
          "bg-[#D32F2F] text-white border-transparent",
        secondary:
          "bg-[#F0F0F0] text-[#444444] border-transparent",
        outline:
          "border border-[#0099FF] text-[#0099FF] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
