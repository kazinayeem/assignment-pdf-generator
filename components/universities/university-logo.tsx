"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { getUniversityLogoUrl } from "@/lib/universities/logos";
import type { University } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

type UniversityLogoProps = {
  university: University;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: { box: "w-10 h-10", text: "text-[10px]", img: 40 },
  md: { box: "w-12 h-12", text: "text-xs", img: 48 },
  lg: { box: "w-20 h-20", text: "text-lg", img: 80 },
};

export function UniversityLogo({ university, size = "md", className }: UniversityLogoProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getUniversityLogoUrl(university);
  const s = SIZES[size];
  const initials = university.shortName.slice(0, 3).toUpperCase();

  return (
    <div
      className={cn(
        s.box,
        "rounded-xl border border-border bg-card flex items-center justify-center overflow-hidden shrink-0",
        className
      )}
      aria-hidden
    >
      {logoUrl && !failed ? (
        <Image
          src={logoUrl}
          alt=""
          width={s.img}
          height={s.img}
          className="object-contain p-1.5 w-full h-full"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : initials.length >= 2 ? (
        <span className={cn(s.text, "font-bold text-brand")}>{initials}</span>
      ) : (
        <GraduationCap size={s.img / 2.5} className="text-brand" />
      )}
    </div>
  );
}
