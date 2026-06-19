/** Premium design system tokens */

export const shell = "mx-auto w-full max-w-[1080px] px-6";

export const shellNarrow = "mx-auto w-full max-w-[640px] px-6";

export const shellWide = "mx-auto w-full max-w-[1200px] px-6 lg:px-8";

export const panel =
  "rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-elevated)] shadow-[var(--shadow-sm)]";

export const panelInset = "rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)]";

export const divider = "border-[var(--color-line)]";

export const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-faint)]";

export const displayLg =
  "font-[family-name:var(--font-display-family)] text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)] sm:text-[2.5rem]";

export const displayMd =
  "font-[family-name:var(--font-display-family)] text-xl font-semibold tracking-[-0.02em] text-[var(--color-ink)] sm:text-2xl";

export const bodyMuted = "text-sm leading-relaxed text-[var(--color-ink-muted)]";

export const headerBar =
  "sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-paper-elevated)]/90 backdrop-blur-xl";

export const headerBarHero =
  "absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0c1222]/40 backdrop-blur-xl";

export const rowHover = "transition-colors hover:bg-[var(--color-paper)]";

export const sectionY = "py-10 sm:py-12";

export const displayLight =
  "font-[family-name:var(--font-display-family)] font-semibold tracking-[-0.03em] text-white";

export const heroSubtitle = "text-[15px] leading-relaxed text-white/70 sm:text-base";

/** @deprecated use shellWide */
export const containerWide = shellWide;

/** @deprecated use shellNarrow */
export const containerNarrow = shellNarrow;

/** @deprecated use panel */
export const surfaceCard = panel;
