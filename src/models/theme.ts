import { defineStyleConfig } from '@chakra-ui/react';
// Global Style Overrides
export const styles = {
    global: {
        // styles for the `body`
        body: {
            fontFamily: 'NunitoFont'
        },
        // styles for the `a`
        a: {
            color: 'mainLinkColor',
            fontWeight: 700,
            fontSize: '16px',
            _hover: {
                textDecoration: 'none'
            }
        }
    }
};

// Button Component Overrides
export const Button = defineStyleConfig({
    // Two variants: outline and solid
    variants: {
        solid: {
            color: 'white'
        }
    },
    defaultProps: {
        size: 'sm',
        variant: 'solid'
    }
});

// Color Overrides
export const colors = {
    default: {
        lightText: '#C7D0E0',
        lightGrayHeader: '#C7D0E0',
        whiteText: '#FFFFFF',
        userCircleHeaderFont: '#1A3F59',
        userCircleHeaderBg: '#B3DDEB',
        hoverSideBarMenu: '#0387B0'
    },
    light: {
        header: '#1A3F59',
        button: '#0387B0'
    },
    dark: {
        header: '#3D3D3F',
        button: '#3296ED',
        borderColor: '#64859C'
    }
};

//spacing
export const spacing = {
    space: {
        2: '2px',
        8: '8px',
        10: '10px',
        15: '15px',
        16: '16px',
        17: '17px',
        38: '38px'
    }
};
