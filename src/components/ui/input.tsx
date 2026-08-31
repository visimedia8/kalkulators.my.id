import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  prefix?: string;
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, prefix, suffix, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[13px] font-medium text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {prefix && (
            <span className="absolute left-4 text-secondary text-[16px]">{prefix}</span>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-[10px] border border-border bg-base px-4 py-3 text-[16px] text-primary transition-colors placeholder:text-secondary/50 focus-visible:outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
              prefix && "pl-10",
              suffix && "pr-10",
              error && "border-danger focus-visible:border-danger",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 text-secondary text-[16px]">{suffix}</span>
          )}
        </div>

        {helperText && (
          <p className={cn("text-[12px]", error ? "text-danger" : "text-secondary")}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
