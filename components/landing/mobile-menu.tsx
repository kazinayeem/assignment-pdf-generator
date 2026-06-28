"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X } from "lucide-react";
import { ALL_TOOLS, FEATURES } from "@/lib/landing-data";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute left-0 top-0 h-full w-[min(320px,85vw)] bg-card shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <Image
                src="/logo_navbar.png"
                alt="CampusFlow"
                width={120}
                height={30}
                style={{ height: 28, width: "auto" }}
              />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2.5 rounded-xl hover:bg-muted cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Productivity
              </p>
              {FEATURES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors min-h-[44px]"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.color}`}>
                    <item.icon size={15} className="text-white" aria-hidden />
                  </div>
                  {item.name}
                </Link>
              ))}
              <p className="px-3 py-2 mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CS Learning
              </p>
              {ALL_TOOLS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors min-h-[44px]"
                >
                  <item.icon size={16} className="text-muted-foreground shrink-0" aria-hidden />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <Link href="/login" onClick={onClose} className="block w-full">
                <button className="btn-premium flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl gradient-primary text-brand-foreground text-sm font-bold hover:shadow-lg hover:shadow-brand/25 transition cursor-pointer min-h-[44px]">
                  <LogIn size={16} /> Sign In
                </button>
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
