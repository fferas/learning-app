import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-md ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
