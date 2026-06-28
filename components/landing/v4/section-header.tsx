"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { badge as badgeStyles } from "@/lib/design-system";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ badge, title, subtitle, align = "center", className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-8 sm:mb-10",
        align === "center" && "text-center max-w-3xl mx-auto",
        className
      )}
    >
      {badge && <span className={cn(badgeStyles.brand, "mb-4")}>{badge}</span>}
      <h2 className="text-heading font-extrabold text-foreground mb-3">{title}</h2>
      {subtitle && <p className="text-body-lg max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}
