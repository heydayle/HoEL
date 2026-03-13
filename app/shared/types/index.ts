/**
 * Supported locale codes for the application.
 */
export type Locale = "en" | "vi";

/**
 * Supported theme modes for the application.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Generic record type for translation messages.
 * Each key maps to a translated string value.
 */
export type TranslationMessages = Record<string, string>;

/**
 * Props interface for components that accept children.
 */
export interface IChildrenProps {
  /** React child nodes to render inside the component */
  children: React.ReactNode;
}
