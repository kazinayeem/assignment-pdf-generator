"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dismissDevelopmentNotice,
  shouldShowDevelopmentNotice,
} from "@/lib/development-notice-storage";
import { cn } from "@/lib/utils";

export function DevelopmentNoticeModal() {
  const [open, setOpen] = useState(false);
  const [hideForToday, setHideForToday] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (shouldShowDevelopmentNotice()) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    dismissDevelopmentNotice(hideForToday);
    setOpen(false);
  }, [hideForToday]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        dismissDevelopmentNotice(hideForToday);
      }
      setOpen(next);
    },
    [hideForToday]
  );

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "glass-card !rounded-[24px] border-border bg-card/95 backdrop-blur-xl",
          "max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-md p-0 gap-0"
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="p-6 sm:p-8"
        >
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground pr-8">
              🚧 CampusFlow is Under Active Development
            </DialogTitle>

            <Badge
              variant="outline"
              className="w-fit border-success/30 bg-success/10 text-success gap-1.5 px-3 py-1"
            >
              <span aria-hidden>🟢</span>
              Development Status · Beta Version
            </Badge>

            <DialogDescription asChild>
              <div className="space-y-3 text-left text-sm text-muted-foreground leading-relaxed">
                <p>Thank you for visiting CampusFlow.</p>
                <p>
                  We are continuously building new features, improving the user experience,
                  fixing bugs, and adding more learning resources.
                </p>
                <p>
                  Some tools or pages may still be incomplete or change over time.
                </p>
                <p>
                  We appreciate your patience and support while we make CampusFlow better
                  every day.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <label className="mt-6 flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={hideForToday}
              onChange={(e) => setHideForToday(e.target.checked)}
              className="size-4 rounded border-border text-brand accent-brand focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-muted-foreground select-none">
              Don&apos;t show again today
            </span>
          </label>

          <DialogFooter className="mt-6 flex-col sm:flex-col gap-3">
            <Button
              onClick={handleDismiss}
              className="w-full min-h-[44px] gradient-primary text-brand-foreground border-0 shadow-md"
            >
              Continue to Website
            </Button>
            <Button variant="outline" asChild className="w-full min-h-[44px]">
              <Link href="/career/roadmaps" onClick={handleDismiss}>
                View Roadmap
              </Link>
            </Button>
          </DialogFooter>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Made with ❤️ for CSE &amp; SWE Students
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
