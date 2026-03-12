import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const TOAST_DURATION = 4200;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

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
            "financeflow-toast group pointer-events-auto relative flex w-[min(92vw,420px)] items-start gap-3 overflow-hidden rounded-[1.35rem] border border-border/80 bg-background px-4 py-3.5 pr-12 text-foreground shadow-[0_18px_42px_-30px_hsl(var(--foreground)/0.4)] backdrop-blur-md",
          content: "flex min-w-0 flex-1 flex-col items-start justify-center",
          title: "text-sm font-semibold leading-5 tracking-tight text-foreground",
          description: "mt-1 text-[13px] leading-5 text-muted-foreground",
          actionButton:
            "mt-2 inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90",
          cancelButton:
            "mt-2 inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-muted px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent",
          closeButton:
            "absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/95 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground",
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
