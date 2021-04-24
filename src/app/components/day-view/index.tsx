import { Paper } from '@material-ui/core';
import React from 'react';
import { useCommonStyles } from '../common-styles';
import { useUser } from '../user-provider';

// interface DayViewProps {}

export const DayView: React.FC = () => {
    const user = useUser();
    const commonClasses = useCommonStyles();

    return (
        <Paper className={commonClasses.paper}>
            <div>Day View: {user.userId}</div>
        </Paper>
    );
}