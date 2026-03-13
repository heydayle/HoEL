"use client";

import type { ButtonHTMLAttributes } from "react";

/**
 * Supported visual variants for the Button component.
 */
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

/**
 * Supported sizes for the Button component.
 */
type ButtonSize = "sm" | "md" | "lg";

/**
 * Props for the Button atom component.
 */
interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Icon element to render before the label */
  icon?: React.ReactNode;
}

/** Map of variant names to their Tailwind class combinations */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-md hover:shadow-lg",
  secondary:
    "bg-accent-secondary text-[#0d0f1a] hover:bg-accent-secondary-hover shadow-md hover:shadow-lg",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-hover",
  outline:
    "bg-transparent text-foreground border border-surface-border hover:bg-surface-hover hover:border-accent-primary",
};

/** Map of size names to their Tailwind class combinations */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

/**
 * Button atom component with multiple visual variants and sizes.
 * Supports icons, disabled state, and all native button attributes.
 * @param props - Button props including variant, size, icon, and native button attributes
 * @returns The rendered Button element
 */
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...rest
}: IButtonProps): React.JSX.Element {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-[var(--radius-md)] font-medium
        transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        active:scale-[0.97]
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
