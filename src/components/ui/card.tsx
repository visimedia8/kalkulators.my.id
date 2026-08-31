import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-border bg-surface text-primary p-4 md:p-6 transition-all duration-200 hover:bg-elevated hover:border-glow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }
