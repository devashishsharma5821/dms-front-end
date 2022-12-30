import { UserConfiguration } from '../models/profile';

export class SessionHelper {
    static getUserConfigFromStorage(): UserConfiguration | undefined {
        const stored = sessionStorage.getItem('userConfig');
        if (!stored) {
            return undefined;
        }
        return JSON.parse(stored);
    }

    static setUserConfigFromStorage(userConfig: UserConfiguration) {
        sessionStorage.setItem('userConfig', JSON.stringify(userConfig));
    }
}
