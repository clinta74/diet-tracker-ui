import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { AUTH0 } from '../config';

export const Auth0ProviderWithHistory: React.FunctionComponent = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = async (appState: AppState) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
            {...AUTH0}
        >
            {children}
        </Auth0Provider>
    );
};