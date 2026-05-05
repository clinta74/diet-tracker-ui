import React, { createContext } from 'react';
import { useAuth } from '../../auth/use-auth';

type HasPermissionHandler = (permissions: string | string[]) => boolean;

interface UserPermissionContext {
    permissions: string[];
    hasPermission: HasPermissionHandler;
}

export const UserPermissionContext = createContext<UserPermissionContext | null>(null);

export const UserPermissionProvider: React.FC = ({ children }) => {
    const { user } = useAuth();
    const permissions = user?.permissions ?? [];

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