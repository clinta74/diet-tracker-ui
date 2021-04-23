import React from 'react';
import { useUser } from '../user-provider';

// interface DayViewProps {}

export const DayView: React.FC = () => {
    const user = useUser();

    return (
        <div>Day View: {user.userId}</div>
    );
}