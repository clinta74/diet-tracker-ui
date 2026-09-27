import React from 'react';
import { useAuth } from './use-auth';

interface AuthenticatedProps {
    invert?: boolean;
}

export const Authenticated: React.FC<React.PropsWithChildren<AuthenticatedProps>> = ({ children, invert }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const show: boolean = invert ? !(isAuthenticated && !isLoading) : (isAuthenticated && !isLoading);

    if (show) {
        return <React.Fragment>{children}</React.Fragment>
    }
    else {
        return null;
    }
}