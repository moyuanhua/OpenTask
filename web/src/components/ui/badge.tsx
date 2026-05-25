import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2",
        variant === 'default' && "border-transparent bg-primary text-primary-foreground",
        variant === 'secondary' && "border-transparent bg-accent text-accent-foreground",
        variant === 'outline' && "text-foreground",
        className
      )}
      {...props}
    />
  )
}
export { Badge }