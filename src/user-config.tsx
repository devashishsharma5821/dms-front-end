import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getUserConfig } from './query';
import { AppRouter } from './app-router';
import { updateI18N, updateAppConfig, updateUserConfig } from './zustandActions/commonActions';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

function UserConfiguration() {
    const { GET_USER_CONFIGURATION } = getUserConfig();
    const [isConfigAvailable, setConfigAvailable] = useState(false);

    let isLoading = true;
    let isError;

    let { loading, error, data } = useQuery(GET_USER_CONFIGURATION);

    isLoading = loading;
    isError = error;
    updateUserConfig(data);

    useEffect(() => {
        if (data?.userConfiguration?.user?.espUserToken) {
            localStorage['espUserToken'] = data.userConfiguration.user.espUserToken ?? '';
        }

        if (data?.userConfiguration?.user?.applications) {
            const dmsApplicationConfiguration = data?.userConfiguration?.user?.applications.filter((app: any) => {
                return app.applicationName === 'dms';
            });

            let config = dmsApplicationConfiguration[0].configJson;
            let i18n = dmsApplicationConfiguration[0].i18n;

            updateI18N(i18n);
            updateAppConfig(config);
            setConfigAvailable(true);
        }
    }, [data]);
    if (isLoading) return <p>Loading...</p>;
    if (isError) {
        return <p>Error : `${isError.toString()}`</p>;
    }

    return <>{isConfigAvailable ? <AppRouter user={data?.userConfiguration?.user}></AppRouter> : <span className="fail"> Configuration access Failed... </span>}</>;
}

export default UserConfiguration;
