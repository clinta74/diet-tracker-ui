import { startOfToday } from 'date-fns';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { dateToString } from '../../../utils/date-to-string';
import { Goals } from './goals';
import { DayView } from './day-view';
import { Plan } from './plan';
import { Trackings } from './trackings';

export const UserRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path="/day/:day" component={DayView} />
            <Route path="/plan" component={Plan} />
            <Route path="/goals" component={Goals} />
            <Route path="/trackings" component={Trackings} />
            <Redirect to={`/day/${dateToString(startOfToday())}`} />
        </Switch>
    );
}