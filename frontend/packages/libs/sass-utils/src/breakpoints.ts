/**
 * Breakpoint değerleri — `src/_variables.scss` içindeki `$breakpoints` map'i ile
 * senkron tutulmalıdır. SCSS tarafı `responsive()` mixin'i üzerinden, JS tarafı
 * `useMediaQuery` üzerinden aynı eşikleri kullanır; biri değişirse diğeri de değişmeli.
 *
 * `xsw` = "xs-wide" — `xs`in genişletilmiş adımı (`xs` ile `sm` arasında).
 */
export const BREAKPOINTS = {
  xs: 400,
  xsw: 550,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
