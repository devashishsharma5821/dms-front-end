import React from 'react';
import ReactDOM from 'react-dom/client';

import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';

import App from './app';
import reportWebVitals from './reportWebVitals';

/* MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders. */
const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
                <App />
            </MsalAuthenticationTemplate>
        </MsalProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
