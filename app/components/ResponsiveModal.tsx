import * as React from "react"
import { useMediaQuery } from "~/hooks/use-media-query"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "~/components/ui/sheet"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerClose } from "~/components/ui/drawer"

interface ResponsiveModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ResponsiveModal({ open, onOpenChange, trigger, title, description, children }: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent className="w-full sm:w-[500px] border-l-0 sm:border-l rounded-l-2xl shadow-2xl overflow-y-auto" side="right" onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader className="text-left mb-7">
            <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col overflow-hidden max-h-[85vh]">
          <DrawerHeader className="text-left flex-shrink-0 mb-4 px-5">
            <DrawerTitle className="text-2xl font-bold">{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-12 w-full touch-pan-y overscroll-contain bg-card">
            {children}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function ResponsiveModalClose({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return <SheetClose asChild>{children}</SheetClose>
  }
  return <DrawerClose asChild>{children}</DrawerClose>
}
