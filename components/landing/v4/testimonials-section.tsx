"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  role: string;
  university?: string;
  department?: string;
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

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center text-sm font-bold text-brand-foreground shrink-0">
      {initials}
    </div>
  );
}

export function TestimonialsSection() {
  const { t, tArray } = useTranslation("home");
  const { t: tV5 } = useTranslation("v5");
  const items = tArray<Testimonial>("testimonials.items");
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const item = items[index];
  if (!item) return null;

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className="blur-orb w-[300px] h-[300px] bg-brand/10 top-10 left-10" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("testimonials.badge")}
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        />

        <div className="max-w-2xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className={cn(card.base, "p-6 sm:p-8")}
            >
              <Quote size={28} className="text-brand/30 mb-4" aria-hidden />
              <StarRating rating={item.rating} />
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed my-5">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Avatar name={item.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                      <BadgeCheck size={12} aria-hidden />
                      {tV5("testimonials.verified")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.department ?? item.role.split(",")[0]?.trim()}
                    {item.university ? ` · ${item.university}` : ` · ${item.role}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="p-2 rounded-xl border border-border hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all min-h-[8px] min-w-[8px]",
                    i === index ? "bg-brand w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="p-2 rounded-xl border border-border hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
        </div>

        {/* Desktop grid preview */}
        <div className="hidden lg:grid grid-cols-3 gap-4 sm:gap-6 mt-12">
          {items.slice(0, 3).map((tItem, i) => (
            <motion.div
              key={tItem.name}
              {...animation.fadeUp}
              {...animation.stagger(i)}
              className={cn(card.base, "p-5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer")}
              onClick={() => setIndex(i)}
            >
              <StarRating rating={tItem.rating} />
              <p className="text-xs text-muted-foreground leading-relaxed my-3 line-clamp-3">
                &ldquo;{tItem.text}&rdquo;
              </p>
              <p className="text-xs font-bold text-foreground">{tItem.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
