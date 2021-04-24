import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Fuelings } from './fuelings';

export const FuelingRoutes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/fuelings" component={Fuelings} />
        </Switch>
    );
}