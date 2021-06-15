import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    makeStyles,
    Theme
} from '@material-ui/core';
import React from 'react';

import { VictoryType } from '../../../api/endpoints/victory';

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


interface VictoriesProps {
    victories?: Victory[];
    onChange: (values: Victory[]) => void;
}

export const Victories: React.FC<VictoriesProps> = ({ victories }) => {
    const classes = useStyles();

    if (victories && victories.length > 0) {
        return (
            <React.Fragment>
                <Card className={classes.card}>
                    <CardHeader title="Victories">Personal victories for today.</CardHeader>
                    <CardContent>
    
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
    else {
        return null;
    }
}