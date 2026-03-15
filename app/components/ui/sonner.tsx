import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-card group-[.toaster]:!text-card-foreground group-[.toaster]:!border-border group-[.toaster]:shadow-sm group-[.toaster]:rounded-2xl p-4 transition-all",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full px-3 py-1 text-xs font-semibold hover:opacity-90 transition-opacity",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-full px-3 py-1 text-xs font-medium hover:bg-muted/80 transition-colors",
          closeButton:
            "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground group-[.toast]:border-muted-foreground/20 hover:!bg-muted/80 hover:!text-foreground transition-all",
          success: "group-[.toaster]:!bg-success/10 group-[.toaster]:!text-success group-[.toaster]:!border-success/20 backdrop-blur-md",
          error: "group-[.toaster]:!bg-destructive/10 group-[.toaster]:!text-destructive group-[.toaster]:!border-destructive/20 backdrop-blur-md",
          warning: "group-[.toaster]:!bg-warning/10 group-[.toaster]:!text-warning group-[.toaster]:!border-warning/20 backdrop-blur-md",
          info: "group-[.toaster]:!bg-info/10 group-[.toaster]:!text-info group-[.toaster]:!border-info/20 backdrop-blur-md",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
