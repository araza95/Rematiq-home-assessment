import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
  isLoading?: boolean;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

/**
 * Primary button component with different variants and sizes
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  text,
  className,
  isLoading = false,
  variant = "default",
  size = "md",
  disabled,
  ...props
}) => {
  // Base classes that apply to all variants
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg";

  // Size specific classes
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  // Variant specific classes
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline:
      "border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100",
    ghost:
      "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100",
    link: "bg-transparent text-blue-500 underline-offset-4 hover:underline p-0 h-auto",
  };

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};

export default PrimaryButton;
