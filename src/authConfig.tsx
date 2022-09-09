import { Configuration, LogLevel, PopupRequest } from '@azure/msal-browser';

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: 'd0e5e988-bb24-4b34-9dff-3cd0eafa6ee1',
        authority: 'https://antuitbtoc.b2clogin.com/antuitbtoc.onmicrosoft.com/b2c_1a_custom_esp-dev-internal',
        knownAuthorities: ['antuitbtoc.b2clogin.com'],
        redirectUri: '/',
        postLogoutRedirectUri: '/'
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error:
                        console.log(message);
                        return;
                    case LogLevel.Info:
                        console.log(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ['https://antuitbtoc.onmicrosoft.com/espdev-scope/api']
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft-ppe.com/v1.0/me'
};
