import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-accent text-white hover:brightness-110 shadow-[0_0_15px_var(--accent-glow)] border border-transparent",
      secondary: "bg-transparent border border-border text-primary hover:border-accent hover:text-accent",
      destructive: "bg-transparent text-danger border border-danger hover:bg-danger/10",
      ghost: "bg-transparent border-transparent text-secondary hover:bg-elevated hover:text-primary",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-[10px] px-6 py-3 text-[15px] font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 min-h-[44px] min-w-[44px]",
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
