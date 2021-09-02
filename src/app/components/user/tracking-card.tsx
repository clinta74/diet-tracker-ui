import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    createStyles,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    makeStyles,
    Modal,
    Paper,
    Switch,
    TextField,
    Theme,
    Typography
} from '@material-ui/core';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';

import { UserTrackingType } from '../../../api/endpoints/user-tracking';
import { getIconMetadata } from './trackings/metadata/icon-tracking-metadata';
import { iconLibrary } from '../../icons';
import { useApi } from '../../../api';
import { dateToString } from './day-view';
import { addDays, parseISO, startOfToday } from 'date-fns';
import clsx from 'clsx';
import { useCommonStyles } from '../common-styles';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        card: {
            margin: theme.spacing(1, 0, 0),
            position: 'relative',
        },
        graphButton: {
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
        },
        graphModal: {
            position: 'absolute',
            top: theme.spacing(2),
            left: theme.spacing(2),
            width: `calc(100% - ${theme.spacing(4)}px)`,
        },
    });
});

const maxInt = 4294967296;

const valueCoverter = {
    [UserTrackingType.Number]: (value: number) => Math.min(value, maxInt),
    [UserTrackingType.WholeNumber]: (value: number) => Math.min(maxInt, Math.max(Math.floor(value), 0)),
    [UserTrackingType.Boolean]: (value: number) => Math.min(value, maxInt),
    [UserTrackingType.Icon]: (value: number) => Math.min(value, maxInt),
}

interface ValueControlProps {
    value: number;
    occurrence: number;
    name: string;
    description: string;
    userTrackingValueId: number;
    type: UserTrackingType;
    metadata: Metadata[];
    whenValue: string;
    useTime: boolean;
}

interface TrackingCardProps {
    tracking: UserTracking;
    values: UserDailyTrackingValue[];
    disable: boolean;
    onChange: (values: UserDailyTrackingValue[]) => void;
}

export const NumberTrackingCard: React.FC<TrackingCardProps> = ({ tracking, values, disable, onChange }) => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const { Api } = useApi();

    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState<UserDailyTrackingValue[]>();

    const { title, description, useTime } = tracking;

    const onChangeValue = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, occurrence: number, userTrackingValueId: number, type: UserTrackingType) => {
        const { value } = event.target;
        const numValue = Number(value);

        if (numValue !== NaN && numValue >= 0) {
            const idx = values.findIndex(value => value.occurrence === occurrence && value.userTrackingValueId === userTrackingValueId);
            onChange([
                ...values.slice(0, idx),
                {
                    ...values[idx],
                    occurrence,
                    userTrackingValueId,
                    value: valueCoverter[type](numValue),
                },
                ...values.slice(idx + 1)
            ])
        }
    }

    const onChangeCheckedValue = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean, occurrence: number, userTrackingValueId: number) => {
        const idx = values.findIndex(value => value.occurrence === occurrence && value.userTrackingValueId === userTrackingValueId);
        onChange([
            ...values.slice(0, idx),
            {
                ...values[idx],
                occurrence,
                userTrackingValueId,
                value: checked ? 1 : 0,
            },
            ...values.slice(idx + 1)
        ]);
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

    const onChangeTrackingValue = (numValue: number, occurrence: number, userTrackingValueId: number, type: UserTrackingType) => {
        if (numValue !== NaN && numValue >= 0) {
            const idx = values.findIndex(value => value.occurrence === occurrence && value.userTrackingValueId === userTrackingValueId);
            onChange([
                ...values.slice(0, idx),
                {
                    ...values[idx],
                    occurrence,
                    userTrackingValueId,
                    value: valueCoverter[type](numValue),
                },
                ...values.slice(idx + 1)
            ])
        }
    }

    const NumberComponent: React.FC<ValueControlProps> = ({ value, occurrence, name, description, userTrackingValueId, type, whenValue, useTime }) =>
        <Grid container spacing={1} key={`tracking-value-${userTrackingValueId}-${occurrence}`}>
            <Grid item xs={12} md={useTime ? 8 : 12}>
                <FormControl fullWidth>
                    <TextField
                        variant="standard"
                        type="number"
                        id={`${name}_name_${occurrence}`}
                        name="name"
                        label={name}
                        value={value || ''}
                        onChange={e => onChangeValue(e, occurrence, userTrackingValueId, type)}
                        helperText={description}
                        disabled={disable} />
                </FormControl>
            </Grid>
            {
                useTime &&
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
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
            }
        </Grid>


    const YesNoComponent: React.FC<ValueControlProps> = ({ value, occurrence, name, description, userTrackingValueId, whenValue, useTime }) =>
        <Grid container spacing={1} key={`tracking-value-${userTrackingValueId}-${occurrence}`}>
            <Grid item xs={12} md={useTime ? 8 : 12}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value !== 0 ? true : false}
                                onChange={(e, checked) => onChangeCheckedValue(e, checked, occurrence, userTrackingValueId)}
                                name={name}
                                color="primary"
                            />
                        }
                        label={name}
                    />
                    <FormHelperText>{description}</FormHelperText>
                </FormControl>
            </Grid>
            {
                useTime &&
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
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
            }
        </Grid>


    const IconComponent: React.FC<ValueControlProps> = ({ value, occurrence, name, description, userTrackingValueId, metadata }) => {
        const { iconName, count } = getIconMetadata(metadata);

        const trackingIcons: boolean[] = new Array(count).fill(false).map((trackingIcon, idx) =>
            (value & Math.pow(2, idx)) === Math.pow(2, idx));

        const onClickTrackingIcon = (idx: number, checked: boolean) => {
            const newValue = checked ? value + Math.pow(2, idx) : value - Math.pow(2, idx);
            onChangeTrackingValue(newValue, occurrence, userTrackingValueId, UserTrackingType.Icon);
        }

        return (
            <Box key={`tracking-value-${userTrackingValueId}-${occurrence}`}>
                <Box>{name}</Box>
                {
                    trackingIcons.map((trackingIcon, idx) =>
                        <Box key={idx} display="inline">
                            {
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={disable}
                                            id={`${name}_name_${occurrence}_${idx}`}
                                            name={`${name}_name_${occurrence}_${idx}`}
                                            checked={trackingIcon}
                                            icon={iconLibrary[iconName]}
                                            checkedIcon={iconLibrary[iconName]}
                                            title={description}
                                            onChange={(e, checked) => onClickTrackingIcon(idx, checked)}
                                        />
                                    }
                                    label=" "
                                />
                            }
                        </Box>
                    )
                }
                <FormHelperText>{description}</FormHelperText>
            </Box>
        );
    }

    const valueControl = {
        [UserTrackingType.Number]: NumberComponent,
        [UserTrackingType.WholeNumber]: NumberComponent,
        [UserTrackingType.Boolean]: YesNoComponent,
        [UserTrackingType.Icon]: IconComponent,
    }

    const onClickShowHistory = () => {
        setHistoryOpen(true);
        Api.UserDailyTracking.getUserDailyTrackingHistoryValues(tracking.userTrackingId, dateToString(addDays(startOfToday(), -14)))
            .then(({ data }) => {
                setHistoryData(data);
            });
    }

    const onClose = () => {
        setHistoryData(undefined);
        setHistoryOpen(false);
    }

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <Box className={classes.graphButton}>
                    <IconButton size="small" onClick={onClickShowHistory}>
                        <TimelineOutlinedIcon />
                    </IconButton>
                </Box>
                <CardHeader title={title} subheader={description} />
                <CardContent>
                    {
                        tracking.values &&
                        tracking.values.map(({ name, description, type, userTrackingValueId, metadata }) => {

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
                                return valueControl[type]({
                                    value,
                                    occurrence,
                                    name,
                                    description,
                                    userTrackingValueId,
                                    type,
                                    metadata,
                                    whenValue,
                                    useTime,
                                })

                            });
                        })
                    }
                </CardContent>
            </Card>

            <Modal open={historyOpen} onClose={onClose} aria-labelledby="graph-modal-title">
                <Paper className={clsx(commonClasses.paper, classes.graphModal)}>
                    <Box mb={2}>
                        <Typography variant="h6" id="graph-modal-title">{title}</Typography>
                    </Box>

                    <Box>
                        <List>
                            {

                                historyData &&
                                historyData.map((history: UserDailyTrackingValue) =>
                                    <ListItem key={`${history.userTrackingValueId}_${history.day}_${history.occurrence}`}>
                                        <Grid container>
                                            <Grid item xs={6} sm={3}>
                                                Day: {dateToString(parseISO(history.day))}
                                            </Grid>
                                            
                                            <Grid item xs={6} sm={3}>
                                                Occurrence: {history.occurrence}
                                            </Grid>

                                            <Grid item xs={6} sm={3}>
                                                Name: {(tracking.values && tracking.values.find(v => v.userTrackingValueId === history.userTrackingValueId)?.name) || ''}
                                            </Grid>

                                            <Grid item xs={6} sm={3}>
                                                Value: {history.value}
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                )
                                || <LinearProgress />
                            }
                        </List>

                    </Box>
                </Paper>
            </Modal>
        </React.Fragment>
    );
}