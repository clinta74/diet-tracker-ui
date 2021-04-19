import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

interface AuthenticatedProps {
    invert?: boolean;
}

export const Authenticated: React.FunctionComponent<AuthenticatedProps> = ({ children, invert }) => {
    const { isAuthenticated, isLoading } = useAuth0();
    const show: boolean =  invert ? !(isAuthenticated && !isLoading) : (isAuthenticated && !isLoading);

    if (show) {
        return <React.Fragment>{children}</React.Fragment>
    }
    else {
        return null;
    }
}