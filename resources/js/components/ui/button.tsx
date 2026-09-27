import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#0099FF]/50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0099FF] text-white shadow-xs hover:bg-[#007ACC]",
        destructive:
          "bg-[#D32F2F] text-white shadow-xs hover:bg-[#B71C1C]",
        outline:
          "border border-[#0099FF] text-[#0099FF] bg-white shadow-xs hover:bg-[#E6F5FF]",
        secondary:
          "border border-[#CCCCCC] bg-[#FAFAFA] text-[#444444] shadow-xs hover:bg-[#F0F0F0]",
        orange:
          "bg-[#FF6000] text-white shadow-xs hover:bg-[#E05500]",
        ghost: "text-[#444444] hover:bg-[#F0F0F0] hover:text-[#0099FF]",
        link: "text-[#0099FF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 text-sm has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
