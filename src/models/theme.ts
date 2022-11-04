import { defineStyleConfig } from '@chakra-ui/react';
// Global Style Overrides
export const styles = {
    global: {
        // styles for the `body`
        body: {
            fontFamily: 'NunitoFont',
            fontWeight: 400,
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
        hoverSideBarMenu: '#0387B0',
        darkGray: '#878787',
        gray: '#B8B8B8',
        blackText: '#333333',
        containerAgGridRecords: ' #646A78',
        agGridBachground: '#EEEEEE'
    },
    light: {
        header: '#1A3F59',
        button: '#0387B0',
        blue: '#0387B0',
        lightGrayishBlue: '#F7FAFC',
        lighterGrayishBlue: '#D8DCDE',
        lightestDarkGray: '#757575',
        hoverSideBarMenu: '#0387B0',
        slightlyDesaturatedBlue: '#9792C8',
        veryDarkBlue: "#08192E",
        grayishBlue:  "#ECEAFD"
    },
    dark: {
        header: '#3D3D3F',
        button: '#3296ED',
        mediumDark: '#464648',
        gray: '#C9C9CA',
        veryDarkGrayishBlue: '#313133',
        veryLightDarkGrayishBlue: '#434248',
        lightGrayishBlue: '#C9C5E9',
        veryDarkGray: '#171717'
    },
    brand: {
        500: '#0387B0'
    }
};

//spacing
export const spacing = {
    space: {
        2: '2px',
        7: '7px',
        8: '8px',
        9: '9px',
        10: '10px',
        11: '11px',
        12: '12px',
        14: '14px',
        15: '15px',
        16: '16px',
        17: '17px',
        20: '20px',
        22: '22px',
        24: '24px',
        38: '38px',
        40: '40px',
        44: '44px',
        54: '54px',
        73: '73px'
    }
};

//sizes
export const sizes = {
    spacing: {
        2: '2px',
        8: '8px',
        10: '10px',
        15: '15px',
        16: '16px',
        17: '17px',
        24: '24px',
        30: '30px',
        35: '35px',
        38: '38px',
        44: '44px',
        54: '54px'
    }
};
