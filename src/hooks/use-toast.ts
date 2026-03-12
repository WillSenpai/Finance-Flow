import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

type ToastActionElement = React.ReactNode;

type Toast = {
  id?: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastActionElement;
};

const toReactNode = (value: React.ReactNode) =>
  typeof value === "string" || typeof value === "number" ? value : undefined;

function toast({ title, description, variant = "default", duration, action }: Toast) {
  const message = toReactNode(title) ?? "";
  const options = {
    description: toReactNode(description),
    duration,
    action,
  };

  if (variant === "destructive") {
    return sonnerToast.error(message || "Errore", options);
  }

  return sonnerToast(message, options);
}

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  };
}

export { useToast, toast };
export type { Toast, ToastActionElement };
