
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
