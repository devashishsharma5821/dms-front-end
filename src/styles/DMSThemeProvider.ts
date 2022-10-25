import { extendTheme } from '@chakra-ui/react';
import { styles, colors, Button, spacing } from '../models/theme';
export const dmsTheme = extendTheme({
    styles,
    colors,
    ...spacing,
    components: {
        Button
    }
});
