export const COLORS = {
  cream: "#F5EFE7",
  creamMid: "#EDE8DF",
  creamDark: "#E0D8CC",
  teal: "#0F5F56",
  teal400: "#176F64",
  teal600: "#0B4D45",
  tealDark: "#083B35",
  accent: "#7CCF5C",
  accentDark: "#5CB840",
  accentLight: "#B6E894",
  black: "#121212",
  gray: "#6B6B6B",
  grayLight: "#9CA3AF",
  grayLine: "#E5E7EB",
  white: "#FFFFFF",
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
} as const;

export const CHART_COLORS = {
  primary:   "#7CCF5C",
  secondary: "#176F64",
  tertiary:  "#0F5F56",
  quaternary:"#B6E894",
  accent:    "#F3C94C",
  neutral:   "#9CA3AF",
  grid:      "rgba(15,95,86,0.07)",
  tooltip:   "#0F2018",
} as const;

export const SPACING = {
  section:   100,
  sectionSm: 64,
  card:      32,
  cardSm:    20,
  gap:       24,
  gapSm:     12,
} as const;

export const TYPOGRAPHY = {
  heroSize:    "clamp(48px, 6vw, 80px)",
  displaySize: "clamp(36px, 4.5vw, 60px)",
  headingSize: "clamp(28px, 3.5vw, 44px)",
  bodySize:    "16px",
  captionSize: "13px",
  labelSize:   "11px",
} as const;

export const BREAKPOINTS = {
  mobile:  640,
  tablet:  768,
  desktop: 1024,
  wide:    1280,
} as const;

export const ANIMATION = {
  durationFast:   "0.2s",
  durationNormal: "0.35s",
  durationSlow:   "0.65s",
  easing:         "cubic-bezier(0.22, 1, 0.36, 1)",
  easingFast:     "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const SHADOWS = {
  card:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  md:     "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
  lg:     "0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
  xl:     "0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
  teal:   "0 8px 24px rgba(15,95,86,0.25)",
  accent: "0 8px 24px rgba(124,207,92,0.35)",
} as const;

export const FONTS = {
  serif:   "'Instrument Serif', 'DM Serif Display', Georgia, serif",
  sans:    "'Satoshi', 'General Sans', 'DM Sans', system-ui, sans-serif",
  display: "'Clash Display', 'Instrument Serif', serif",
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
} as const;

// ─── Currency formatter ───────────────────────────────────────────────────
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINRCompact = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// ─── Date helpers ─────────────────────────────────────────────────────────
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const formatDateShort = (date: Date | string): string => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
};

// ─── Category colors ──────────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#7CCF5C",
  Food:          "#F3C94C",
  Shopping:      "#60B4FF",
  Utilities:     "#C084FC",
  Health:        "#FB923C",
  Transport:     "#34D399",
  Education:     "#F472B6",
  Subscriptions: "#0F5F56",
  Savings:       "#22C55E",
  Investment:    "#3B82F6",
  Other:         "#9CA3AF",
};

export type CategoryKey = keyof typeof CATEGORY_COLORS;
