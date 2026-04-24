import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Neo-Brutalism styled textarea field.
 * Features thick black border, bento radius, and solid shadow focus state.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground flex min-h-16 w-full rounded-[calc(var(--rounded-bento)*0.6)] border-2 border-brutal-black bg-brutal-white px-3 py-2 text-sm font-medium shadow-[var(--shadow-brutal-sm)] transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus:shadow-[var(--shadow-brutal-md)] focus:-translate-y-0.5 focus:-translate-x-0.5",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
