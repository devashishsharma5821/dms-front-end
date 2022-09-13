export const DMS_CONFIG = {
    BASE_URL: '/dms',
    AGGRID_LICENSE_KEY:
        'CompanyName=Antuit, Inc.,LicensedGroup=antuit.ai,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=3,AssetReference=AG-017687,ExpiryDate=3_September_2022_[v2]_MTY2MjE1OTYwMDAwMA==01375b12adb2682a99a002a213c84dea',
    IDENTITY_PROVIDER: 'azure',
    GRAPHQL_SERVER: 'https://api-b2c.espdev.antuits.com/',
    AZURE: {
        msalConfig: {
            auth: {
                clientId: 'd0e5e988-bb24-4b34-9dff-3cd0eafa6ee1',
                authority: 'https://antuitbtoc.b2clogin.com/antuitbtoc.onmicrosoft.com/b2c_1a_custom_esp-dev-internal',
                knownAuthorities: ['antuitbtoc.b2clogin.com'],
                redirectUri: '/',
                postLogoutRedirectUri: '/'
            },
            cache: {
                cacheLocation: 'localStorage'
            },
            system: {
                iframeHashTimeout: 10000
            }
        },
        protectedResources: {
            api: {
                endpoint: 'https://api-b2c.espdev.antuits.com/',
                scopes: ['https://antuitbtoc.onmicrosoft.com/espdev-scope/api']
            }
        }
    }
};
