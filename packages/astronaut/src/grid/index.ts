import type { Props as GridProps } from "./grid.astro";
import type { Props as GridItemProps } from "./item.astro";
import Grid from "./grid.astro";
import Item from "./item.astro";

export type { GridProps, GridItemProps };
export default Object.assign(Grid, { Item });