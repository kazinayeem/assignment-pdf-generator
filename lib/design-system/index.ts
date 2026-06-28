export const spacing = {
  section: "section-padding",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  containerNarrow: "max-w-3xl mx-auto px-4 sm:px-6",
  containerWide: "max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8",
  stackSm: "space-y-4",
  stackMd: "space-y-6",
  stackLg: "space-y-8",
  gapGrid: "gap-4 sm:gap-5 lg:gap-6",
} as const;

export const sectionBg = {
  surface: "section-surface",
  elevated: "section-elevated",
  mesh: "section-mesh",
  glass: "section-glass",
  muted: "section-muted",
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
  glowLg: "shadow-xl shadow-brand/20",
  card: "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(109,93,246,0.08)]",
} as const;

export const typography = {
  hero: "text-hero font-extrabold tracking-tight",
  heading: "text-heading font-extrabold tracking-tight",
  subheading: "text-subheading font-semibold",
  cardTitle: "text-card-title font-bold",
  body: "text-base text-muted-foreground leading-relaxed",
  bodyLg: "text-body-lg text-muted-foreground leading-relaxed",
  caption: "text-caption text-muted-foreground",
  label: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
} as const;

export const animation = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.4 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.97 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { type: "spring" as const, damping: 26, stiffness: 320 },
  },
  stagger: (i: number) => ({ transition: { delay: Math.min(i * 0.06, 0.36) } }),
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const iconBox = {
  sm: "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
  md: "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
  lg: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
} as const;

export const card = {
  base: "glass-card border border-border bg-card/90 backdrop-blur-xl rounded-2xl",
  hover: "glass-card-interactive transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 hover:border-brand/25",
  interactive: "cursor-pointer group glass-card-interactive",
  equal: "h-full flex flex-col",
} as const;

export const button = {
  primary:
    "btn-premium gradient-primary text-brand-foreground font-semibold min-h-[44px] px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-brand/25 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "border border-border bg-background text-foreground font-semibold min-h-[44px] px-6 py-3 rounded-xl hover:bg-muted hover:border-brand/20 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-muted min-h-[44px] px-4 py-2 rounded-xl focus-visible:ring-2 focus-visible:ring-brand transition-all",
  sm: "text-sm min-h-[40px] px-4 py-2 rounded-xl",
} as const;

export const badge = {
  brand: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20",
  success: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20",
  warning: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20",
  muted: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border",
  new: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-brand-accent/15 text-brand-accent border border-brand-accent/25",
  popular: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-warning/15 text-warning border border-warning/25",
  beta: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/25",
} as const;

export const input = {
  base: "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px] transition-colors",
} as const;

export const link = {
  brand: "text-brand font-semibold hover:underline underline-offset-4 transition-colors",
  muted: "text-muted-foreground hover:text-foreground transition-colors",
} as const;
