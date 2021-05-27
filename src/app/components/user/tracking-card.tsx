import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    FormControl,
    makeStyles,
    Theme
} from '@material-ui/core';
import React from 'react';

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

interface TrackingCardProps {
    trackings: CurrentUserDailyTracking[];
    onChange: (trackings: CurrentUserDailyTracking[]) => void;
}
export const NumberTrackingCard: React.FC<TrackingCardProps> = ({ trackings }) => {
    const classes = useStyles();

    const { name, description } = trackings[0];

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardHeader title={name}>{description}</CardHeader>
                <CardContent>
                    <FormControl fullWidth className={classes.formControl}>

                    </FormControl>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}