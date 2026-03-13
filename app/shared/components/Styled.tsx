/**
 * Centralized export hub for all shadcn/ui components.
 * All shadcn/ui components must be imported from this file
 * throughout the application. This allows consistent component
 * access and makes it easy to apply global overrides or wrappers.
 *
 * @example
 * ```tsx
 * import { Button, Card, Badge } from '@/app/shared/components/Styled';
 * ```
 */

export { Badge, badgeVariants } from "@/components/ui/badge";
export { Button, buttonVariants } from "@/components/ui/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export { Input } from "@/components/ui/input";
export { Separator } from "@/components/ui/separator";
