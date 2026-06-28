export const spacing = {
  section: "section-padding",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  stackSm: "space-y-4",
  stackMd: "space-y-6",
  stackLg: "space-y-8",
  gapGrid: "gap-4 sm:gap-6 lg:gap-8",
} as const;

export const radius = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[24px]",
  full: "rounded-full",
} as const;

export const shadow = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  glow: "shadow-lg shadow-brand/10",
} as const;

export const typography = {
  hero: "text-hero font-extrabold tracking-tight",
  heading: "text-heading font-bold tracking-tight",
  subheading: "text-subheading font-semibold",
  body: "text-base text-muted-foreground leading-relaxed",
  caption: "text-sm text-muted-foreground",
  label: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
} as const;

export const animation = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.4 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { type: "spring" as const, damping: 24, stiffness: 300 },
  },
  stagger: (i: number) => ({ transition: { delay: i * 0.08 } }),
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const card = {
  base: "glass-card border border-border bg-card/80 backdrop-blur-xl",
  hover: "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:border-brand/20",
  interactive: "cursor-pointer group",
} as const;

export const button = {
  primary: "gradient-primary text-brand-foreground font-semibold min-h-[44px] px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-brand/20 transition-all",
  secondary: "border border-border bg-background text-foreground font-semibold min-h-[44px] px-6 py-3 rounded-xl hover:bg-muted transition-all",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted min-h-[44px] px-4 py-2 rounded-xl transition-all",
} as const;

export const badge = {
  brand: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20",
  success: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20",
  muted: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground",
} as const;
