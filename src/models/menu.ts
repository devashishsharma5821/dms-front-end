import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'
import colors from './theme';
// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(['menu', 'item'])

export const Menu = helpers.defineMultiStyleConfig({
  baseStyle: {
    menu: {
      boxShadow: 'lg',
      rounded: 'lg',
      flexDirection: 'column',
      py: '2'
    },
    list: {
      minWidth: '50px'
    },
    item: {
      //Font color
     
      //Font Bold, Font Family
      _focus: {
        background: 'none'
      },
      _hover: {
        background: colors.default.mouseHOverForm
      }
    },
  },
  
  sizes: {
    sm: {
      item: {
        fontSize: '0.75rem',
        px: 2,
        py: 1,
      },
    },
    md: {
      item: {
        fontSize: '1rem',
        px: 3,
        py: 2,
      },
    },
  },
  variants: {
    bold: {
      item: {
        fontWeight: 'bold',
      },
      menu: {
        boxShadow: 'xl',
      },
    },
    colorful: {
      item: {
        color: 'orange.600',
      },
      menu: {
        bg: 'orange.100',
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
});
