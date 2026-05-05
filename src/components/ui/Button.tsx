"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "warning" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
  secondary:
    "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
  success:
    "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400",
  warning:
    "bg-amber-400 hover:bg-amber-500 text-white focus:ring-amber-300",
  ghost:
    "bg-white hover:bg-amber-50 text-gray-700 border border-gray-200 focus:ring-gray-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
  xl: "h-16 px-10 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          font-bold rounded-2xl
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
