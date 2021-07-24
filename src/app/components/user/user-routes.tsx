import { startOfToday } from 'date-fns';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { dateToString } from '../../../utils/date-to-string';
import { Goals } from './goals';
import { DayView } from './day-view';
import { Plan } from './plan';
import { Trackings } from './trackings/trackings';
import { EditTracking } from './trackings/edit-trackings';
import { AddTracking } from './trackings/add-trackings';
import { Water } from './water';

export const UserRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path="/day/:day" component={DayView} />
            <Route path="/settings">
                <Plan />
                <Water />
            </Route>
            <Route path="/goals" component={Goals} />
            <Route path="/tracking/add" component={AddTracking} />
            <Route path="/tracking/:userTrackingId" component={EditTracking} />
            <Route path="/trackings" component={Trackings} />
            <Redirect to={`/day/${dateToString(startOfToday())}`} />
        </Switch>
    );
}