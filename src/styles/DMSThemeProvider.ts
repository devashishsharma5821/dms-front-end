import { extendTheme } from '@chakra-ui/react';
import { styles, colors, Button, spacing, sizes, Popover} from '../models/theme';
import { Drawer } from '../models/drawer';
import { Menu } from '../models/menu';
import { multiSelectTheme } from '../models/multiSelectTheme';
import { avatarTheme } from '../models/avatar';
export const dmsTheme = extendTheme({
    styles,
    colors,
    ...spacing,
    ...sizes,
    components: {
        Menu,
        Button,
        Drawer,
        Popover,
        Avatar: avatarTheme,
        MultiSelect: multiSelectTheme
    }
});
