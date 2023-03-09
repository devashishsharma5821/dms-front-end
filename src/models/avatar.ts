import { avatarAnatomy as parts } from "@chakra-ui/anatomy"
import {
    createMultiStyleConfigHelpers
} from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys)


function getSize(size: any) {
    if(size === '32px') {
        return definePartsStyle({
            container: {
                width: size,
                height: size,
                fontSize: '10px'
            },
            excessLabel: {
                width: size,
                height: size,
                fontSize: '10px'
            },
            label: {
                fontSize: `16px`,
            },
        })
    } else if(size === '100%') {
        return definePartsStyle({
            label: {
                fontSize: `32px`,
            },
        })
    } else {
        return definePartsStyle({})
    }

}

const sizes = {
    "2xs": getSize(4),
    xs: getSize(6),
    sm: getSize(8),
    md: getSize('32px'),
    lg: getSize(16),
    xl: getSize(24),
    "2xl": getSize(32),
    full: getSize("100%"),
}

export const avatarTheme = defineMultiStyleConfig({
    sizes,
    defaultProps: { size: "md" },
})
