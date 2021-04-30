import React, { Children, createContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import jwt_decode from "jwt-decode";

type HasPermissionHandler = (permissions: string | string[]) => boolean;

interface UserPermissionContext {
    permissions: string[];
    hasPermission: HasPermissionHandler;
}

interface JWT {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: string[];
}

export const UserPermissionContext = createContext<UserPermissionContext | null>(null);

export const UserPermissionProvider: React.FC = ({ children }) => {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently()
                .then(token => {
                    const jwt = jwt_decode<JWT>(token);
                    setPermissions(jwt.permissions);
                })
                .catch(console.error);

        }
    }, [isAuthenticated, user]);

    const hasPermission: HasPermissionHandler = (permissionList) => {
        if (Array.isArray(permissionList)) {
            return permissionList.some(p => permissions.includes(p));
        }
        else {
            return permissions.includes(permissionList)
        }
    }

    return (
        <React.Fragment>
            {
                <UserPermissionContext.Provider value={{ permissions, hasPermission }}>{children}</UserPermissionContext.Provider>
            }
        </React.Fragment>
    );
}

export const useUserPermission = () => {
    const context = React.useContext(UserPermissionContext)
    if (context === null) throw new Error('useUserPermission must be used within a UserPermissionProvider');
    return context;
}

interface UserPermissionProps {
    permissions: string | string[];
}

export const Authorized: React.FC<UserPermissionProps> = ({permissions, children}) => {
    const { hasPermission } = useUserPermission();
    return (
        <React.Fragment>
        {
            hasPermission(permissions) && children
        }
        </React.Fragment>
    );
}