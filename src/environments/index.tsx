export const ENVIRONMENT = {
    BASE_URL: '/dms',
    VERSION: 'v3.1.2',
    AGGRID_LICENSE_KEY: 'CompanyName=Antuit, Inc.,LicensedGroup=antuit.ai,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=3,AssetReference=AG-030746,SupportServicesEnd=3_September_2023_[v2]_MTY5MzY5NTYwMDAwMA==2290aef0909f25ac395f29691245b752',
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
