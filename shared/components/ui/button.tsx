"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border-2 border-brutal-black bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none cursor-pointer shadow-[var(--shadow-brutal-sm)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[var(--shadow-brutal-md)] active:translate-y-px active:translate-x-px active:shadow-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline:
          "bg-brutal-white text-foreground hover:bg-lemon hover:text-black",
        secondary:
          "bg-lemon text-black hover:bg-lemon-hover",
        ghost:
          "bg-transparent text-foreground border-transparent shadow-none hover:bg-surface-hover hover:shadow-none hover:translate-y-0 hover:translate-x-0",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none hover:translate-y-0 hover:translate-x-0",
      },
      size: {
        default:
          "h-9 gap-1.5 px-5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-4 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-10",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
