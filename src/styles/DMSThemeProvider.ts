import { extendTheme } from '@chakra-ui/react';
import { styles, colors, Button, spacing, sizes } from '../models/theme';
import { Drawer } from '../models/drawer';
export const dmsTheme = extendTheme({
    styles,
    colors,
    ...spacing,
    ...sizes,
    components: {
        Button,
        Drawer
    }
});
