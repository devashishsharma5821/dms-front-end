import { useEffect } from 'react';
import { useMsal, useAccount, useIsAuthenticated } from '@azure/msal-react';
import { EventType, InteractionRequiredAuthError } from '@azure/msal-browser';
import { protectedResources } from './authConfig';
import UserConfiguration from './user-config';
import { ENVIRONMENT } from './environments';
import { Box, Flex } from '@chakra-ui/react';
import './global.scss';
console.log('dms: ', ENVIRONMENT.VERSION);
const App = () => {
    const { instance, accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});
    const isAuthenticated = useIsAuthenticated();
    useEffect(() => {
        if (account && inProgress === 'none') {
            instance
                .acquireTokenSilent({
                    scopes: protectedResources.scopes,
                    account: account
                })
                .then((response) => {
                    console.log('AcquireTokenSilent success..');
                    localStorage['accessToken'] = response.accessToken;
                })
                .catch((error) => {
                    // in case if silent token acquisition fails, fallback to an interactive method
                    if (error instanceof InteractionRequiredAuthError) {
                        if (account && inProgress === 'none') {
                            instance
                                .acquireTokenPopup({
                                    scopes: protectedResources.scopes
                                })
                                .then((response) => {
                                    console.log('AcquireTokenPopup success..');
                                    localStorage['accessToken'] = response.accessToken;
                                })
                                .catch((error) => console.log(error));
                        }
                    }
                });
        }
    }, [account, inProgress, instance]);

    useEffect(() => {
        // instance.logout();

        const callbackId = instance.addEventCallback((event: any) => {
            if (event.eventType === EventType.LOGIN_FAILURE) {
                instance.logout();
            }
            if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
                console.log('login is successfull..');
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
    }, [instance]);

    return (
        <Box>
            {isAuthenticated ? <UserConfiguration></UserConfiguration> : <span className="fail"> Login Failed.. </span>}
        </Box>
    );
};

export default App;
