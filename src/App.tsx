import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMsal, useAccount } from '@azure/msal-react';
import { EventType, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
const DashboardPage = lazy(() => import('./pages/dashboard'));

const App = () => {
    const { instance, accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});
    useEffect(() => {
        if (account && inProgress === 'none') {
            instance
                .acquireTokenSilent({
                    scopes: loginRequest.scopes,
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
                                    scopes: loginRequest.scopes
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
        const callbackId = instance.addEventCallback((event: any) => {
            debugger;
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
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
