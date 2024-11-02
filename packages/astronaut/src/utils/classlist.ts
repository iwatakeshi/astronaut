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

interface ParsedClass {
  original: string;
  breakpoint: string;
  utility: string;
  modifier?: string;
  weight: number;
}

export class ClassList {
  private static readonly BREAKPOINT_ORDER: Record<string, number> = {
    'base': 0,
    '_': 0,
    'sm': 1,
    'md': 2,
    'lg': 3,
    'xl': 4,
    '2xl': 5
  };

  private static parseClass(className: string): ParsedClass {
    const breakpointMatch = className?.match?.(/^(sm:|md:|lg:|xl:|2xl:)?(.+)$/);
    if (!breakpointMatch) {
      return {
        original: className,
        breakpoint: 'base',
        utility: className,
        weight: 0
      };
    }

    const [, breakpoint = 'base', remainder] = breakpointMatch;
    const cleanBreakpoint = breakpoint.replace(':', '');

    // Split utility and modifier (e.g., "gap-y" from "gap-y-36")
    const [utility, ...modifierParts] = remainder.split('-');
    const modifier = modifierParts.join('-');

    return {
      original: className,
      breakpoint: cleanBreakpoint,
      utility,
      modifier: modifier || undefined,
      weight: (this.BREAKPOINT_ORDER[cleanBreakpoint] || 0) * 1000 + (modifier ? 1 : 0)
    };
  }

  private static sortClasses(classes: string[]): string[] {
    const parsedClasses = classes.map(cls => this.parseClass(cls));

    // Group by utility
    const groupedClasses: Record<string, ParsedClass[]> = {};
    parsedClasses.forEach(cls => {
      if (!groupedClasses[cls.utility]) {
        groupedClasses[cls.utility] = [];
      }
      groupedClasses[cls.utility].push(cls);
    });

    // Sort within groups and flatten
    return Object.values(groupedClasses)
      .flatMap(group =>
        group
          .sort((a, b) => a.weight - b.weight)
          .map(cls => cls.original)
      );
  }

  static fromResponsiveValue<T extends string | number>(
    prefix: string | null,
    value: ResponsiveValue<T> | undefined,
    { format: formatter, filter }: Options = {}
  ): string {
    if (value === undefined) return "";

    const $formatter: ClassFormatter = formatter ?? ((value, prefix, breakpoint) => {

      if (["base", "_"].includes(breakpoint) && prefix) {
        if (prefix === 'display') return `${value}`;
        return `${prefix}-${value}`;
      }
      if (["base", "_"].includes(breakpoint) && !prefix) {
        return `${value}`;
      }

      if (prefix === 'display') return `${breakpoint}:${value}`;
      return `${breakpoint}:${prefix}-${value}`;
    });

    if (typeof value === "object") {
      const classes = Object.entries(value).map(([breakpoint, value]) => {
        if (value === undefined) return "";
        if (filter && !filter(value)) return "";

        return $formatter(value, prefix, breakpoint);
      });

      return this.sortClasses(classes.filter(Boolean)).join(" ").trim();
    }

    return $formatter(value, prefix, "base").trim();
  }

  static add(list: AstroBuiltinAttributes["class:list"], ...classes: string[]) {
    const allClasses = this.dedupe(
      [
        ...ClassList.toArray(list).flatMap(ClassList.dedupe),
        ...classes.flatMap(ClassList.dedupe)
      ].filter(Boolean)
    );

    return this.sortClasses(allClasses).join(" ").trim();
  }

  static toArray(list: AstroBuiltinAttributes["class:list"]): string[] {
    if (typeof list === "undefined" || list === null) return [];
    if (typeof list === "string") return list.split(" ");
    if (Array.isArray(list)) return list;

    if (list !== null && list !== undefined) {
      if ((list as any)[Symbol.iterator]) {
        return [...(list as Iterable<any>)].map(item => item.toString());
      }

      if (typeof list === "object") {
        return Object.entries(list)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
    }

    return [];
  }

  static dedupe(list: AstroBuiltinAttributes["class:list"]) {
    return Array.from(new Set(ClassList.toArray(list)));
  }
}