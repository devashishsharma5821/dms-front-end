import { defineStyleConfig } from '@chakra-ui/react';
// Global Style Overrides
export const styles = {
    global: {
        // styles for the `body`
        body: {
            fontFamily: 'ibm-plex-sans , Fallback, sans-serif',
            fontWeight: 400
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

// PopOver Component Overrides
export const Popover = defineStyleConfig({
    // Two variants: outline and solid
    variants: {
        responsive: {
            popper: {
                maxWidth: 'unset',
                width: '314px'
            }
        }
    }
});

// Color Overrides
export const colors = {
    default: {
        lightText: '#C7D0E0',
        lightGrayHeader: '#C7D0E0',
        whiteText: '#FFFFFF',
        blackText: '#333333',
        userCircleHeaderFont: '#1A3F59',
        userCircleHeaderBg: '#B3DDEB',
        hoverSideBarMenu: '#0387B0',
        darkGray: '#878787',
        gray: '#B8B8B8',
        containerAgGridRecords: ' #646A78',
        agGridBachground: '#EEEEEE',
        toolbarButton: '#2180C2',
        displayOffButton: '#EDEFF4',
        downArrowHeader: '#A3B4D1',
        mouseHOverForm: 'rgba(3, 135, 176, 0.1)',
        modalShareText: '#2D373E',
        BlackText: ' #111111',
        shareModalButton: '#2180C2',
        defaultTextColorInBox: 'rgba(51, 51, 51, 0.5)',
        dividerColor: '#EAEAEA',
        titleForShare: '#4C4C4C',
        veryLightGrayTextColor: ' #B3B3B3',
        silverGray: '#aaaaaa',
        redLigh: ' #E05F70',
        linkColor: '#017BA1',
        lightGray: '#F2F4F5',
        darkGrayCreate: '#666C80',
        bgExclamationText: 'rgba(50, 150, 237, 0.2)',
        bgExclamationIcon: '#BFE1FF',
        tagBoxColor: '#F2F4F8',
        textDeployPiplineButton: '#AEB1B8',
        accessByNumber: '#75858F',
        bgDatasetLevels: '#929AA9',
        titleForDropFile: ' #1D1E23',
        textButton: '#0073E6'
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
        veryDarkBlue: '#08192E',
        grayishBlue: '#ECEAFD',
        badge: '#2E2E2E'
    },
    dark: {
        header: '#3D3D3F',
        button: '#3296ED',
        mediumDark: '#464648',
        gray: '#C9C9CA',
        veryDarkGrayishBlue: '#313133',
        veryLightDarkGrayishBlue: '#434248',
        lightGrayishBlue: '#C9C5E9',
        veryDarkGray: '#171717',
        bgDark: '#1a202c',
        badge: '#BFE1FF'
    },
    brand: {
        500: '#0387B0'
    },
    tabsTheme: {
        600: '#0073E6'
    }
};

//spacing
export const spacing = {
    space: {
        0: '0px',
        2: '2px',
        4: '4px',
        6: '6px',
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
        18: '18px',
        19: '19px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        32: '32px',
        36: '36px',
        38: '38px',
        40: '40px',
        44: '44px',
        49: '49px',
        54: '54px',
        56: '56px',
        57: '57px',
        75: '75px',
        110: '110px',
        127: '127px',
        60: '60px',
        180: '180px',
        464: '464px'
    }
};

//sizes
export const sizes = {
    spacing: {
        0: '0px',
        2: '2px',
        3: '3px',
        4: '4px',
        5: '5px',
        6: '6px',
        8: '8px',
        9: '9px',
        10: '10px',
        12: '12px',
        13: '13px',
        15: '15px',
        16: '16px',
        17: '17px',
        19: '19px',
        20: '20px',
        24: '24px',
        26: '26px',
        30: '30px',
        32: '32px',
        35: '35px',
        36: '36px',
        38: '38px',
        40: '40px',
        44: '44px',
        49: '49px',
        54: '54px',
        66: '66px',
        72: '72px',
        75: '75px',
        110: '110px',
        300: '300px',
        472: '472px',
        581: '581px',
        667: '667px',
        734: '734px'
    }
};
export default colors;
