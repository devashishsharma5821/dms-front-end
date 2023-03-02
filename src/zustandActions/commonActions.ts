import useAppStore from '../store';
import {
    updateI18N as updateI18NType,
    updateAppConfig as updateAppConfigType,
    updateDmsDatabricksCredentialsValidToken as updateDmsDatabricksCredentialsValidTokenType,
    updateUserConfig as updateUserConfigType,
    getAndUpdateAllUsersData as updateAllUsersDataType
} from '../models/zustandStore';
import client from '../apollo-client';
import { GET_USERS_OF_ESP } from '../query';
import { AllUsers, GetAllUsersType } from '../models/profile';

export const getAndUpdateAllUsersData: updateAllUsersDataType = async (variables: any) => {
    const response = await client.query<GetAllUsersType<Array<AllUsers>>>({
        query: GET_USERS_OF_ESP(variables)
    });
    const usersWithDMSAccess = response.data.getUsers.users.filter((user) => {
        const applicationNames = user.applicationName?.split(',') || [];
        const applicationName = 'dms';
        const findUser = applicationNames.find((name) => name === applicationName);
        if (findUser) return user;
    });
    useAppStore.setState(() => ({ AllUsersData: usersWithDMSAccess }));
};
export const updateI18N: updateI18NType = (translation = {}) => useAppStore.setState(() => ({ i18n: translation }));
export const updateAppConfig: updateAppConfigType = (config = {}) => useAppStore.setState(() => ({ config: config }));
export const updateDmsDatabricksCredentialsValidToken: updateDmsDatabricksCredentialsValidTokenType = (token: boolean) => useAppStore.setState(() => ({ DmsDatabricksCredentialsValidToken: token }));
export const updateUserConfig: updateUserConfigType = (UserConfig: any) => useAppStore.setState(() => ({ UserConfig: UserConfig }));

export const updateSpinnerInfo: any = (SpinnerInfo: any) => useAppStore.setState(() => ({ SpinnerInfo: SpinnerInfo }));
