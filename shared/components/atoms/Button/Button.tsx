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

/** Map of variant names to their Neo-Brutalist Tailwind class combinations */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground",
  secondary:
    "bg-lemon text-black hover:bg-lemon-hover",
  ghost:
    "bg-transparent text-foreground border-transparent shadow-none hover:bg-surface-hover hover:shadow-none hover:translate-y-0 hover:translate-x-0",
  outline:
    "bg-brutal-white text-foreground hover:bg-lemon hover:text-black",
};

/** Map of size names to their Tailwind class combinations */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

/**
 * Button atom component with Neo-Brutalism styling.
 * Features pill shape, thick black borders, and solid offset shadows
 * with pop effect on hover.
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
        rounded-full border-2 border-brutal-black font-bold
        shadow-[var(--shadow-brutal-sm)]
        transition-all duration-200
        cursor-pointer
        hover:-translate-y-0.5 hover:-translate-x-0.5
        hover:shadow-[var(--shadow-brutal-md)]
        active:translate-y-px active:translate-x-px active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
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
