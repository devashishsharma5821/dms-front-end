import { mode } from '@chakra-ui/theme-tools'

const parts = [
    'item',
    'selectedItem',
    'list',
    'textList',
    'selectedList',
    'actionGroup',
    'control',
    'input',
    'button',
    'groupTitle',
    'divider',
    'label',
]

function baseStyleList(props: Record<string, any>) {
    return {
        bg: mode(`#fff`, `gray.700`)(props),
        boxShadow: mode(`sm`, `dark-lg`)(props),
        color: 'inherit',
        w: 'full',
        py: '2',
        zIndex: 9999,
        borderRadius: '3px',
        borderWidth: '1px',
        maxH: '64',
        overflowY: 'scroll',
        overflowX: 'hidden',
        overscrollBehaviorY: 'contain',
    }
}

const baseStyleSelectedList = {
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    bg: mode(`#fff`, `gray.700`),
    zIndex: 9999
}

const baseStyleLabel = {
    fontSize: '16px',
    marginEnd: 3,
    mb: 2,
    fontWeight: '400',
    color: '#111111',
    transition: 'all 0.2s',
    opacity: 1,
    marginLeft: '20px',
    _disabled: {
        opacity: 0.4,
    },
}

function baseStyleItem(props: Record<string, any>) {
    return {
        cursor: 'pointer',
        transition: 'background 50ms ease-out',
        _focus: {
            bg: mode(`gray.50`, `whiteAlpha.100`)(props),
            boxShadow: 'outline',
        },
        _active: {
            bg: mode(`gray.50`, `whiteAlpha.100`)(props),
        },
        _expanded: {
            bg: mode(`gray.50`, `whiteAlpha.100`)(props),
        },
        _selected: {
            bg: mode(`gray.100`, `whiteAlpha.300`)(props),
        },
        _disabled: {
            opacity: 0.4,
            cursor: 'not-allowed',
        },
    }
}

function baseStyleSelectedItem(props: Record<string, any>) {
    return {
        borderRadius: '3px',
        variant: 'solid',
        bg: mode(`#F2F4F8`, `whiteAlpha.300`)(props),
        color: mode(`#1A3F59`, `white`)(props),
        fontSize: '16px',
        fontWeight: 600,
        padding: '4px 6px',
        colorscheme: props.colorscheme,
    }
}

function baseStyleButton(props: Record<string, any>) {
    return {
        variant: 'ghost',
        _hover: {
            bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        },
        _focus: {
            bg: mode(`gray.200`, `whiteAlpha.300`)(props),
            boxShadow: 'outline',
        },
        _active: {
            bg: mode(`gray.100`, `whiteAlpha.100`)(props),
        },
        colorscheme: props.colorscheme,
    }
}

const baseStyleControl = {
    h: 'auto',
    minW: 72,
    bg: mode(`#fff`, `gray.700`),
    zIndex: 9999
}

// eslint-disable-next-line
const baseStyleInput = (_props: Record<string, any>) => ({
    bgColor: 'transparent',
    appearance: 'none',
    flex: 1,
    outline: 0,
})

const baseStyleActionGroup = {
    display: 'flex',
    alignItems: 'center',
}

const baseStyleGroupTitle = {
    fontWeight: 'semibold',
}

const baseStyleDivider = {
    display: 'inline',
    h: 'full',
    border: 0,
    borderColor: 'inherit',
    my: 1,
    opacity: 0.8,
}

const baseStyle = (props: Record<string, any>) => ({
    list: baseStyleList(props),
    selectedList: baseStyleSelectedList,
    item: baseStyleItem(props),
    selectedItem: baseStyleSelectedItem(props),
    button: baseStyleButton(props),
    actionGroup: baseStyleActionGroup,
    control: baseStyleControl,
    input: baseStyleInput(props),
    groupTitle: baseStyleGroupTitle,
    divider: baseStyleDivider,
    label: baseStyleLabel,
})

export const sizes = {
    sm: {
        control: {
            minH: 8,
            px: 1,
            spacing: 1,
        },
        input: {
            m: 'px',
        },
        actionGroup: {
            spacing: '0',
        },
        item: {
            py: 1,
            px: 2,
        },
        textList: {
            py: 0,
            px: 1,
        },
        selectedItem: {
            m: 'px',
        },
        selectedList: {
            py: 'px',
        },
        groupTitle: {
            mx: 2,
            my: 1,
            fontSize: 'sm',
        },
    },
    md: {
        control: {
            minH: 10,
            px: 1,
            spacing: 1,
            justifyContent: 'space-between',
            marginLeft: '20px'
        },
        input: {
            m: '2px',
            width: '510px',
            height: '36px',
            maxWidth: '510px'
        },
        actionGroup: {
            spacing: '0',
        },
        item: {
            py: 2,
            px: 3,
        },
        textList: {
            p: 1,
        },
        selectedItem: {
            m: '2px',
        },
        selectedList: {
            py: '2px',
        },
        groupTitle: {
            mx: 4,
            my: 2,
            fontSize: 'sm',
        },
    },
    lg: {
        control: {
            minH: 12,
            px: 2,
            spacing: 2,
        },
        input: {
            m: 1,
        },
        actionGroup: {
            spacing: '0',
        },
        item: {
            py: 2,
            px: 3,
        },
        textList: {
            py: 1,
            px: 2,
        },
        selectedItem: {
            m: 1,
        },
        selectedList: {
            py: 1,
        },
        groupTitle: {
            mx: 4,
            my: 2,
            fontSize: 'sm',
        },
    },
}

export const multiSelectTheme =   {
    defaultProps: {
        size: 'md',
    },
    parts,
    sizes,
    baseStyle,
}
