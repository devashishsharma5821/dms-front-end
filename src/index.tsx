import React from 'react';
import ReactDOM from 'react-dom/client';

import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { API_ENFPOINTS } from './environments';
import { msalConfig } from './authConfig';

import App from './App';
import reportWebVitals from './reportWebVitals';

/* MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders. */
const msalInstance = new PublicClientApplication(msalConfig);

const client = new ApolloClient({
    uri: API_ENFPOINTS,
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <MsalProvider instance={msalInstance}>
                <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
                    <App />
                </MsalAuthenticationTemplate>
            </MsalProvider>
        </ApolloProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
