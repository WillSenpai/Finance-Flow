import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const TOAST_DURATION = 4200;

const Toaster = ({ ...props }: ToasterProps) => {
  const themeState = useTheme();
  const theme = themeState?.resolvedTheme ?? themeState?.theme ?? "system";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      closeButton
      expand
      visibleToasts={3}
      duration={TOAST_DURATION}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "financeflow-toast group pointer-events-auto relative flex w-[min(92vw,420px)] items-center gap-3 overflow-hidden rounded-2xl border border-border/50 bg-background px-4 py-3.5 pb-[1.15rem] text-foreground shadow-[0_8px_40px_-12px_hsl(var(--foreground)/0.22),0_2px_12px_-4px_hsl(var(--foreground)/0.10)] backdrop-blur-xl",
          content: "flex min-w-0 flex-1 flex-col items-start justify-center",
          title: "text-[13.5px] font-semibold leading-snug tracking-tight text-foreground",
          description: "mt-0.5 text-[12.5px] leading-snug text-muted-foreground",
          actionButton:
            "mt-2 inline-flex h-[28px] shrink-0 items-center justify-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.97]",
          cancelButton:
            "mt-2 inline-flex h-[28px] shrink-0 items-center justify-center rounded-lg bg-muted px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent active:scale-[0.97]",
          closeButton: "financeflow-toast-close",
          success: "financeflow-toast-success",
          error: "financeflow-toast-error",
          warning: "financeflow-toast-warning",
          info: "financeflow-toast-info",
        },
        style: {
          ["--toast-duration" as string]: `${TOAST_DURATION}ms`,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
