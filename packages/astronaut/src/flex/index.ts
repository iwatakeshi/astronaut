import Flex from "./flex.astro";
import Item from "./item.astro";
import type { Props as FlexProps } from "./flex.astro";
import type { Props as FlexItemProps } from "./item.astro";

export type { FlexProps, FlexItemProps };

export default Object.assign(Flex, { Item });
