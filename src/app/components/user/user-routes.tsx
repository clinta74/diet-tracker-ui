import { startOfToday } from 'date-fns';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { dateToString } from '../../../utils/date-to-string';
import { Goals } from './goals';
import { DayView } from './day/day-view';
import { Plan } from './plan';
import { Trackings } from './trackings/trackings';
import { EditTracking } from './trackings/edit-trackings';
import { AddTracking } from './trackings/add-trackings';
import { Water } from './water';
import { UserProvider } from '../../providers/user-provider';

export const UserRoutes: React.FC = () => {
    return (
        <UserProvider>
            <Routes>
                <Route path="/day/:day" element={<DayView />} />
                <Route path="/settings" element={
                    <React.Fragment>
                        <Plan />
                        <Water />
                    </React.Fragment>
                } />
                <Route path="/goals" element={<Goals />} />
                <Route path="/tracking/add" element={<AddTracking />} />
                <Route path="/tracking/:userTrackingId" element={<EditTracking />} />
                <Route path="/trackings" element={<Trackings />} />
                <Route path="*" element={<Navigate to={`/day/${dateToString(startOfToday())}`} />} />
            </Routes>
        </UserProvider >
    );
}