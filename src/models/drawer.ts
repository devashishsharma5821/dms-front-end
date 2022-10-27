import { drawerAnatomy as parts } from "@chakra-ui/anatomy"
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system"
import { mode } from "@chakra-ui/theme-tools"
import { runIfFn } from "./utils"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

/**
 * Since the `maxWidth` prop references theme.sizes internally,
 * we can leverage that to size our modals.
 */
function getSize(value: string) {
  if (value === "full") {
    return definePartsStyle({
      dialog: { maxW: "100vw", h: "100vh", top:'44px' },
    })
  }
  return definePartsStyle({
    dialog: { maxW: value, top:'44px' },
  })
}

const baseStyleOverlay = defineStyle({
  bg: "tranparent",
  zIndex: "overlay",
  top:'44px'
})

const baseStyleDialogContainer = defineStyle({
  display: "flex",
  zIndex: "modal",
  justifyContent: "center",
  top:'44px'
})



const baseStyleHeader = defineStyle({
    fontStyle: 'normal',
    fontWeight: 600 ,
    fontSize: '20px',
    lineHeight: '24px',
})



const baseStyle = definePartsStyle((props) => ({
  overlay: baseStyleOverlay,
  dialogContainer: baseStyleDialogContainer,
  header: baseStyleHeader,
}))

const sizes = {
  xs: getSize("xs"),
  sm: getSize("md"),
  md: getSize("lg"),
  lg: getSize("2xl"),
  xl: getSize("4xl"),
  full: getSize("full"),
}

export const Drawer = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {
    size: "xs",
  },
})