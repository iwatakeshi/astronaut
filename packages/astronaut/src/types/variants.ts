export type ResponsiveValue<T extends string | number = string | number> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  [key: string]: T | undefined;
};