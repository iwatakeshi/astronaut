// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import Box from "./src/box/box.astro";
import Grid from "./src/grid";
import Flex from "./src/flex";
import Text from './src/typography/text.astro';

import type { Props as BoxProps } from "./src/box/box.astro";
import type { Props as TextProps } from './src/typography/text.astro';
import type { ResponsiveValue } from "./src/types/variants";
export type { BoxProps, TextProps, ResponsiveValue };
export { Box, Grid, Flex, Text };
