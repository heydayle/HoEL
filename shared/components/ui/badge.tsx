import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 border-brutal-black px-3 py-0.5 text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/80",
        secondary:
          "bg-lemon text-brutal-black [a&]:hover:bg-lemon-hover",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/80",
        outline:
          "bg-brutal-white text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Neo-Brutalism badge with thick border and pill shape.
 */
function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
