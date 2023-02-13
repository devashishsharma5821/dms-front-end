import useAppStore from '../store';
import {
    updateI18N as updateI18NType,
    updateAppConfig as updateAppConfigType,
    updateDmsDatabricksCredentialsValidToken as updateDmsDatabricksCredentialsValidTokenType,
    updateUserConfig as updateUserConfigType
} from '../models/zustandStore';

export const updateI18N: updateI18NType = (translation = {}) => useAppStore.setState(() => ({ i18n: translation }));
export const updateAppConfig: updateAppConfigType = (config = {}) => useAppStore.setState(() => ({ config: config }));
export const updateDmsDatabricksCredentialsValidToken: updateDmsDatabricksCredentialsValidTokenType = (token: boolean) => useAppStore.setState(() => ({ DmsDatabricksCredentialsValidToken: token }));
export const updateUserConfig: updateUserConfigType = (UserConfig: any) => useAppStore.setState(() => ({ UserConfig: UserConfig }));
