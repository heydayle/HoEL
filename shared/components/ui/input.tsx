import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Neo-Brutalism styled input field.
 * Features thick black border, bento radius, and solid shadow focus state.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-lemon selection:text-brutal-black flex h-10 w-full min-w-0 rounded-[calc(var(--rounded-bento)*0.6)] border-2 border-brutal-black bg-brutal-white px-3 py-1 text-sm font-medium shadow-[var(--shadow-brutal-sm)] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:opacity-50 focus:shadow-[var(--shadow-brutal-md)] focus:-translate-y-0.5 focus:-translate-x-0.5",
        className
      )}
      {...props}
    />
  )
}

export { Input }
