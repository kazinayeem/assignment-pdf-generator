"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            i < rating ? "text-warning fill-warning" : "text-muted-foreground/30"
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { t, tArray } = useTranslation("home");
  const items = tArray<Testimonial>("testimonials.items");

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className="blur-orb w-[300px] h-[300px] bg-brand/10 top-10 left-10" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("testimonials.badge")}
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              {...animation.fadeUp}
              {...animation.stagger(i)}
              className={cn(card.base, "p-6 sm:p-8 flex flex-col")}
            >
              <Quote size={28} className="text-brand/30 mb-4" aria-hidden />
              <StarRating rating={item.rating} />
              <p className="text-sm text-muted-foreground leading-relaxed my-4 flex-1">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-bold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
