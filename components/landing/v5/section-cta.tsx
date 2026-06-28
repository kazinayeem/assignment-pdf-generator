"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

type SectionCtaProps = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function SectionCta({ label, href, variant = "primary", className }: SectionCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("flex justify-center mt-10 sm:mt-12", className)}
    >
      <Link
        href={href}
        className={cn(
          variant === "primary" ? button.primary : button.secondary,
          "inline-flex items-center gap-2 group"
        )}
      >
        {label}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>
    </motion.div>
  );
}
