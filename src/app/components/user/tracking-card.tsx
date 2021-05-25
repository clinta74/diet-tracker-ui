import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

interface TrackingCardProps {
    value: CurrentUserDailyTracking;
    onChange: (value: CurrentUserDailyTracking) => void;
}
const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        card: {
            margin: theme.spacing(1, 0, 0),
        },
        formControl: {
            marginBottom: theme.spacing(1),
        }
    });
});

export const NumberTrackingCard: React.FC<TrackingCardProps> = ({ value }) => {
    const classes = useStyles();

    return (
        <div></div>
    );
}