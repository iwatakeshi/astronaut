import type { AstroBuiltinAttributes } from "astro";
import type { ResponsiveValue } from "../types/variants";

type ClassFormatter = (
  value: string | number,
  prefix: string | null,
  breakpoint: string
) => string;
interface Options {
  format?: ClassFormatter;
  filter?: (value: string | number) => boolean;
}

export class ClassList {
  static fromResponsiveValue<T extends string | number>(
    prefix: string | null,
    value: ResponsiveValue<T> | undefined,
    { format: formatter, filter }: Options = {}
  ) {
    if (value === undefined) return "";
    const $formatter = formatter
      ? formatter
      : (value: string | number, prefix: string | null, breakpoint: string) => {
          if (["base", "_"].includes(breakpoint) && prefix)
            return `${prefix}-${value}`;
          if (["base", "_"].includes(breakpoint) && !prefix) {
            return `${value}`;
          }
          return `${breakpoint}:${prefix}-${value}`;
        };

    if (typeof value === "object") {
      const classes = Object.entries(value).map(([breakpoint, value]) => {
        if (value === undefined) return "";
        if (filter && typeof filter === "function" && !filter(value)) return "";

        return $formatter(value, prefix, breakpoint);
      });

      return classes.join(" ").trim();
    }

    return $formatter(value, prefix, "base").trim();
  }

  static add(list: AstroBuiltinAttributes["class:list"], ...classes: string[]) {
    return [...ClassList.toArray(list), ...classes].join(" ").trim();
  }

  static toArray(list: AstroBuiltinAttributes["class:list"]) {
    if (typeof list === "undefined" || list === null) return [];
    if (typeof list === "string") return [list];
    if (Array.isArray(list)) return list;
    if (list !== null || list !== undefined) {
      if ((list as any)[Symbol.iterator])
        return [...(list as Iterable<any>)].map((item) => item.toString());

      if (typeof list === "object")
        return Object.entries(list)
          .filter(([, value]) => !!value)
          .map(([key]) => key);
    }

    return [];
  }
}
