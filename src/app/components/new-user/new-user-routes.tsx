import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewUser } from './new-user';

export const NewUserRoutes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/new-user" component={NewUser} />
        </Switch>
    );
}