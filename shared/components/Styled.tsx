/**
 * Centralized export hub for all shadcn/ui components.
 * All shadcn/ui components must be imported from this file
 * throughout the application. This allows consistent component
 * access and makes it easy to apply global overrides or wrappers.
 *
 * @example
 * ```tsx
 * import { Button, Card, Badge } from '@/shared/components/Styled';
 * ```
 */

export { Badge, badgeVariants } from "@/shared/components/ui/badge";
export { Button, buttonVariants } from "@/shared/components/ui/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
export { Input } from "@/shared/components/ui/input";
export { Textarea } from "@/shared/components/ui/textarea";
export { Separator } from "@/shared/components/ui/separator";
export { Toaster } from "@/shared/components/ui/sonner";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/shared/components/ui/select";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/shared/components/ui/dropdown-menu";
export { Skeleton } from "@/shared/components/ui/skeleton";
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
