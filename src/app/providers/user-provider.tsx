import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Api } from '../../api';
import { useAlertMessage } from './alert-provider';

export const UserContext = createContext<CurrentUser | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<CurrentUser>();
    const alert = useAlertMessage();
    const history = useHistory();

    useEffect(() => {
        Api.User.getUserExists()
            .then(({ data }) => {
                if (data) {
                    Api.User.getUser()
                        .then(({ data }) => {
                            if (data) {

                            }
                            setUser(data);
                        })
                        .catch((error: any) => alert.addMessage(error.message));
                }
            })
            .catch((error: any) => alert.addMessage(error.message));
    }, [history]);

    return (
        <UserContext.Provider value={user}>{user && children}</UserContext.Provider>
    );
}

export const useUser = () => {
    const context = React.useContext(UserContext)
    if (context === undefined) throw new Error('useUser must be used within a UserProvider');
    return context;
}