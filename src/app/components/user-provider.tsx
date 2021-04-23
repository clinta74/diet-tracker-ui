import { AxiosError } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Api } from '../../api';

export const UserContext = createContext<User | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User>();
    const history = useHistory();

    useEffect(() => {
        Api.User.getUser()
            .then(({ data }) => {
                setUser(data);
            })
            .catch((result: AxiosError) => {
                if (result.response?.status === 404) {
                    history.push('/newUser')
                }
            });
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