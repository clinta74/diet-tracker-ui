import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    FormControl,
    Grid,
    makeStyles,
    TextField,
    Theme
} from '@material-ui/core';
import React from 'react';

import { UserTrackingType } from '../../../api/endpoints/user-tracking';

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
    tracking: UserTracking;
    values: UserDailyTrackingValue[];
    disable: boolean;
    onChange: (values: UserDailyTrackingValue[]) => void;
}

export const NumberTrackingCard: React.FC<TrackingCardProps> = ({ tracking, values, disable, onChange }) => {
    const classes = useStyles();

    const { title, description } = tracking;

    const onChangeValue = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, occurrence: number, userTrackingValueId: number) => {
        const { value } = event.target;
        const numValue = Number(value);

        if (numValue) {
            const idx = values.findIndex(value => value.occurrence === occurrence && value.userTrackingValueId === userTrackingValueId)
            onChange([
                ...values.slice(0, idx),
                {
                    ...values[idx],
                    occurrence,
                    userTrackingValueId,
                    value: numValue,
                },
                ...values.slice(idx + 1)
            ])
        }
    }

    const onChangeWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, occurrence: number, userTrackingValueId: number) => {
        const { value } = event.target;
        const idx = values.findIndex(value => value.occurrence === occurrence && value.userTrackingValueId === userTrackingValueId)
        onChange([
            ...values.slice(0, idx),
            {
                ...values[idx],
                occurrence,
                userTrackingValueId,
                when: value ? `0001-01-01T${value}` : null,
            },
            ...values.slice(idx + 1)
        ])
    }

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardHeader title={title}>{description}</CardHeader>
                <CardContent>
                    {
                        tracking.values &&
                        tracking.values.map(({ name, description, type, userTrackingValueId }) => {

                            const occurrences: number[] = [];
                            for (let idx = 1; idx <= tracking.occurrences; idx++) {
                                occurrences.push(idx);
                            }

                            return occurrences.map(occurrence => {
                                const { value, when } = values.find(v => v.occurrence === occurrence && v.userTrackingValueId === userTrackingValueId) || {
                                    value: 0,
                                    when: null,
                                };

                                const whenValue = when === null || when === undefined ? '' : when.split('T')[1];
                                return (
                                    <Grid container spacing={1} key={`tracking-value-${userTrackingValueId}`}>
                                        <Grid item xs={12} md={8}>
                                            {
                                                type === UserTrackingType.Number &&
                                                <FormControl fullWidth className={classes.formControl}>
                                                    <TextField
                                                        variant="standard"
                                                        type="number"
                                                        id={`${name}_name_${occurrence}`}
                                                        name="name"
                                                        label={name}
                                                        value={value || ''}
                                                        onChange={e => onChangeValue(e, occurrence, userTrackingValueId)}
                                                        helperText={description}
                                                        disabled={disable} />
                                                </FormControl>
                                            }
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth className={classes.formControl}>
                                                <TextField
                                                    type="time"
                                                    autoComplete="false"
                                                    id={`${name}_when_${occurrence}`}
                                                    value={whenValue}
                                                    name="when"
                                                    label=" "
                                                    onChange={e => onChangeWhen(e, occurrence, userTrackingValueId)}
                                                    disabled={disable} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                );
                            });
                        })
                    }
                    <FormControl fullWidth className={classes.formControl}>

                    </FormControl>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}