import { menuAnatomy as parts } from "@chakra-ui/anatomy"
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system"
import colors from "../models/theme"
const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys)

const $bg = cssVar("menu-bg")

const $shadow = cssVar("menu-shadow")

const baseStyleList = defineStyle({
  // [$bg.variable]: "#fff",
  // [$shadow.variable]: "shadows.sm",
  // _dark: {
  //   [$bg.variable]: "colors.gray.700",
  //   [$shadow.variable]: "shadows.dark-lg",
  // },
   color: colors.default.textColorMenu,
  minW: "4xs",
  // py: "2",
  // zIndex: 1,
  // borderRadius: "md",
 
  // bg: "default.mouseHOverForm",
  // boxShadow: "default.mouseHOverForm",
})

const baseStyleItem = defineStyle({
  // py: "1.5",
  // px: "3",
  // transitionProperty: "background",
  // transitionDuration: "ultra-fast",
  // transitionTimingFunction: "ease-in",
  // _focus: {
  //   [$bg.variable]: "colors.gray.100",
  //   _dark: {
  //     [$bg.variable]: "colors.whiteAlpha.100",
  //   },
  // },
  // _hover:{
  //   [$bg.variable]: "colors.gray.200",
  //   _dark: {
  //     [$bg.variable]: "colors.gray.200",
  //   },
  // },
  //   _active: {
  //   [$bg.variable]: "colors.gray.200",
  //   _dark: {
  //     [$bg.variable]: "colors.whiteAlpha.200",
  //   },
  // },
  // _expanded: {
  //   [$bg.variable]: "colors.gray.100",
  //   _dark: {
  //     [$bg.variable]: "colors.whiteAlpha.100",
  //   },
  // },
  // _disabled: {
  //   opacity: 0.4,
  //   cursor: "not-allowed",
  // },
  // bg: $bg.reference,
})

const baseStyleGroupTitle = defineStyle({
  // mx: 4,
  // my: 2,
  // fontWeight: "semibold",
  // fontSize: "sm",
})

const baseStyleCommand = defineStyle({
  // opacity: 0.6,
})

const baseStyleDivider = defineStyle({
  // border: 0,
  // borderBottom: "1px solid",
  // borderColor: "inherit",
  // my: "2",
  // opacity: 0.6,
})

const baseStyleButton = defineStyle({
  //transitionProperty: "common",
  //transitionDuration: "normal",
})

const baseStyle = definePartsStyle({
  button: baseStyleButton,
  list: baseStyleList,
  item: baseStyleItem,
  groupTitle: baseStyleGroupTitle,
  command: baseStyleCommand,
  divider: baseStyleDivider,
  bg: 'rgba(3, 135, 176, 0.1)' ,
  
})

export const Menu = defineMultiStyleConfig({
  baseStyle,
})