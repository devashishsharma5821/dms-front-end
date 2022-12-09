export interface AppAlerts {
}

export interface Applications {
    applicationId: number;
    applicationName: string;
    configJson: any;
    i18n: any;
}
export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    locale?: any;
    defaultApp: string;
    appAlerts: AppAlerts;
    espUserToken: string;
    applications:Applications[];
}

export interface UserConfiguration {
    user: User;
    error?: any;
}

export interface Data {
    userConfiguration: UserConfiguration;
}

export interface UserConfigurationResponse {
    data: Data;
}