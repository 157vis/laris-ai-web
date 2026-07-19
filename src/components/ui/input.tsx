import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative w-full">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
