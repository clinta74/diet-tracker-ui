import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    Grid,
    Paper,
    TextField,
    Typography,
    makeStyles,
    Theme,
    createStyles,
    InputLabel,
    Input,
    Button,
    CircularProgress,
    IconButton,
    Hidden,
    Card,
    CardContent,
    CardHeader,
} from '@material-ui/core';
import clsx from 'clsx';
import { format, startOfToday, addDays, parseISO, getDay, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LocalDrinkIcon from '@material-ui/icons/LocalDrinkOutlined';
import { useCommonStyles } from '../common-styles';
import { useApi } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { useUser } from '../../providers/user-provider';

const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');

let autoSaveId: NodeJS.Timeout;

const useStyles = makeStyles((theme: Theme) => {
    const backgroundColors = ['plum', 'lightpink', 'Khaki', 'Aquamarine', 'Wheat', 'PowderBlue', 'Seashell'];

    return createStyles({
        activeLossGain: {
            color: theme.palette.text.disabled,
        },
        buttonProgress: {
            position: 'absolute',
            left: '1.5em',
            top: '5px',
        },
        paperBackground: {
            backgroundColor: (data: { dayOfWeek: number }) => backgroundColors[data.dayOfWeek],
            marginBottom: theme.spacing(1),
        },
        waterFill: {
            fill: 'blue'
        },
        card: {
            margin: theme.spacing(1, 0, 0),
        },
        formControl: {
            marginBottom: theme.spacing(1),
        },
        autoSave: {
            position: 'absolute',
            right: theme.spacing(4),
            top: theme.spacing(6),
            zIndex: theme.zIndex.appBar + 1,
        }
    });
});

interface Params {
    day: string;
}

interface TrackedCurrentUserDay extends CurrentUserDay { hasChanged: boolean }

export const DayView: React.FC = () => {
    const params = useParams<Params>();
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const history = useHistory();
    const { Api } = useApi();
    const { user } = useUser();

    const [day, setDay] = useState<Date>(startOfToday());
    const [userDay, setUserDay] = useState<TrackedCurrentUserDay>();
    const [fuelings, setFuelings] = useState<Fueling[]>([]);
    const [postingDay, setPostingDay] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);

    const classes = useStyles({ dayOfWeek: getDay(day) });

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => setFuelings(data.sort((a, b) => a.name > b.name ? 1 : -1)))
            .catch(error => alert.addMessage(error));
    }, []);

    useEffect(() => {
        clearTimeout(autoSaveId);
        const day = params.day ? parseISO(params.day) : startOfToday();
        setDay(day);
        Api.Day.getDay(dateToString(day))
            .then(({ data }) => setUserDay({ ...data, hasChanged: false }))
            .catch(error => alert.addMessage(error));
    }, [params]);

    // useEffect(() => {
    //     if (userDay?.hasChanged && !autoSaving) {
    //         if (autoSaveId) clearTimeout(autoSaveId);
    //         autoSaveId = setTimeout(async () => {
    //             setAutoSaving(true);
    //             try {
    //                 const { data } = await Api.Day.updateDay(dateToString(day), userDay);
    //                 setUserDay({ ...data, hasChanged: false });
    //             }
    //             catch (ex) {
    //                 clearTimeout(autoSaveId);
    //             }
    //             finally {
    //                 setAutoSaving(false);
    //             }
    //         }, 2000);
    //     }
    // }, [userDay])

    const onChangeWater: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const water = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                water,
                hasChanged: true,
            }
        });
    }

    const onChangeCondiments: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const condiments = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                condiments,
                hasChanged: true,
            }
        });
    }

    const onChangeWeight: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const weight = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                weight,
                hasChanged: true,
            }
        });
    }

    const onChangeFuelingName = (event: React.ChangeEvent<unknown>, value: string | null, idx: number) => {
        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    hasChanged: true,
                    fuelings: [..._userDay.fuelings.slice(0, idx),
                    {
                        ..._userDay.fuelings[idx],
                        name: value || '',
                    },
                    ..._userDay.fuelings.slice(idx + 1)],
                }
            }
        });
    }

    const onChangeFuelingWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    hasChanged: true,
                    fuelings: [..._userDay.fuelings.slice(0, idx),
                    {
                        ..._userDay.fuelings[idx],
                        when: value ? `0001-01-01T${value}` : null,
                    },
                    ..._userDay.fuelings.slice(idx + 1)],
                }
            }
        });
    }

    const onChangeMealName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    hasChanged: true,
                    meals: [..._userDay.meals.slice(0, idx),
                    {
                        ..._userDay.meals[idx],
                        name: value || '',
                    },
                    ..._userDay.meals.slice(idx + 1)],
                }
            }
        });
    }

    const onChangeMealWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    hasChanged: true,
                    meals: [..._userDay.meals.slice(0, idx),
                    {
                        ..._userDay.meals[idx],
                        when: value ? `0001-01-01T${value}` : null,
                    },
                    ..._userDay.meals.slice(idx + 1)],
                }
            }
        });
    }

    const onChangeNotes: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    hasChanged: true,
                    notes: value || '',
                }
            }
        });
    }

    const onClickSave = async () => {
        if (userDay && userDay.hasChanged) {
            setPostingDay(true);
            try {
                const { data } = await Api.Day.updateDay(dateToString(day), userDay);
                setUserDay({ ...data, hasChanged: false });
            }
            catch (error) {
                alert.addMessage(error);
            }
            finally {
                setPostingDay(false);
            }
        }
    }

    const onClickReset: React.MouseEventHandler<HTMLButtonElement> = () => {
        Api.Day.getDay(dateToString(day))
            .then(({ data }) => setUserDay({ ...data, hasChanged: false }))
            .catch(error => alert.addMessage(error));
    }

    const waterTarget = user.waterTarget || 64;
    const waterSize = user.waterSize || 8;
    const waterMarks: boolean[] = new Array(Math.ceil(waterTarget / waterSize));
    if (userDay) {
        const end = Math.floor(userDay.water / waterSize);
        waterMarks.fill(false);
        waterMarks.fill(true, 0, end);
    }

    const onClickWaterMark: React.MouseEventHandler = () => {
        setUserDay(_userDay => {
            if (_userDay) {
                const water = _userDay.water + waterSize - _userDay.water % waterSize;
                return {
                    ..._userDay as CurrentUserDay,
                    hasChanged: true,
                    water,
                }
            }
        });
    }

    const onClickNextDay = async () => {
        await onClickSave();
        history.push(`/day/${dateToString(addDays(day, 1))}`);
    }

    const onClickPrevDay = async () => {
        await onClickSave();
        history.push(`/day/${dateToString(addDays(day, -1))}`);
    }

    const filter = createFilterOptions<string>();

    const dateText = formatDistanceToNowStrict(day, { addSuffix: true, unit: 'day', roundingMethod: 'floor' });
    const formatDateText: { [key: string]: string } = {
        '0 days ago': 'today',
        'in 0 days': 'tomorrow',
    }

    return (
        <React.Fragment>
            {
                autoSaving &&
                <div className={classes.autoSave}><CircularProgress /></div>
            }
            <Paper className={clsx([commonClasses.paper, classes.paperBackground])}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={onClickPrevDay}>
                        <ArrowBackIcon />
                    </IconButton>

                    <Box flexGrow={1} textAlign="center">
                        <Typography variant="h4">
                            {format(day, 'EEEE')}
                            <Hidden smDown>{format(day, ', MMM dd')}</Hidden>
                            <Hidden mdDown>{format(day, ', yyyy')}</Hidden>
                        </Typography>
                        <Box textAlign="center">{formatDateText[dateText] || dateText}</Box>
                    </Box>

                    <IconButton onClick={onClickNextDay}>
                        <ArrowForwardIcon />
                    </IconButton>
                </Box>
            </Paper>

            {
                userDay &&
                <React.Fragment>
                    <form noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Card className={classes.card}>
                                    <CardHeader title="Fuelings" />
                                    <CardContent>
                                        {
                                            userDay.fuelings.map((fueling, idx) => {
                                                const when = fueling.when === null ? '' : fueling.when.split('T')[1];
                                                return <Grid container spacing={2} key={`fueling_${idx}`}>
                                                    <Grid item xs={7} sm={8} lg={9}>
                                                        <FormControl fullWidth className={classes.formControl}>
                                                            <Autocomplete
                                                                freeSolo
                                                                options={fuelings.map(fueling => fueling.name)}
                                                                value={fueling.name}
                                                                onInputChange={(e, v) => onChangeFuelingName(e, v, idx)}
                                                                filterOptions={(options, params) => {
                                                                    params.inputValue = fueling.name;
                                                                    return filter(options, params);
                                                                }}
                                                                disabled={postingDay}
                                                                renderInput={(params) => (
                                                                    <TextField autoComplete="off" {...params} name="name" />
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={5} sm={4} lg={3}>
                                                        <FormControl fullWidth className={classes.formControl}>
                                                            <TextField type="time" name="when" autoComplete="off" value={when} onChange={e => onChangeFuelingWhen(e, idx)} disabled={postingDay} />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            })
                                        }
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card className={classes.card}>
                                    <CardHeader title="Lean and Green" />
                                    <CardContent>
                                        {
                                            userDay.meals.map((meal, idx) => {
                                                const when = meal.when === null ? '' : meal.when.split('T')[1];
                                                return <Grid container spacing={2} key={`meal_${idx}`}>
                                                    <Grid item xs={7} sm={8} lg={9}>
                                                        <FormControl fullWidth className={classes.formControl}>
                                                            <TextField value={meal.name} name="name" onChange={e => onChangeMealName(e, idx)} disabled={postingDay} />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={5} sm={4} lg={3}>
                                                        <FormControl fullWidth className={classes.formControl}>
                                                            <TextField type="time" autoComplete="false" value={when} name="when" onChange={e => onChangeMealWhen(e, idx)} disabled={postingDay} />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            }
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card className={classes.card}>
                                    <CardHeader title="Weight" />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth>
                                                    <TextField variant="standard" type="number" label="Weight" id="weight" name="weight" value={userDay.weight ? userDay.weight : ''} onChange={onChangeWeight} disabled={postingDay} />
                                                </FormControl>
                                            </Grid>


                                            <Grid item xs={6} md={3}>
                                                <Box display="flex" alignItems="flex-end">
                                                    <Box mr={1} mt={2} mb={-1}>
                                                        <Box mb={-2}>
                                                            <RemoveIcon fontSize="small" className={clsx({
                                                                [classes.activeLossGain]: userDay.weightChange < 0
                                                            })} />
                                                        </Box>
                                                        <Box>
                                                            <AddIcon fontSize="small" className={clsx({
                                                                [classes.activeLossGain]: userDay.weightChange > 0
                                                            })} />
                                                        </Box>
                                                    </Box>
                                                    <FormControl fullWidth >
                                                        <InputLabel>Loss/Gain</InputLabel>
                                                        <Input readOnly value={userDay.weightChange ? Math.abs(userDay.weightChange) : ''} />
                                                    </FormControl>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={6} md={3}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Cumulative</InputLabel>
                                                    <Input readOnly value={userDay.cumulativeWeightChange ? userDay.cumulativeWeightChange : ''} />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6} lg={3}>
                                <Card className={classes.card}>
                                    <CardHeader title="Water" />
                                    <CardContent>
                                        <FormControl fullWidth className={classes.formControl}>
                                            <TextField variant="standard" type="number" label="Water" id="water" name="water" value={userDay.water ? userDay.water : ''} onChange={onChangeWater} disabled={postingDay} />
                                            <Box>
                                                {
                                                    waterMarks.map((mark, idx) =>
                                                        <React.Fragment key={idx}>
                                                            {
                                                                mark && <LocalDrinkIcon className={classes.waterFill} />
                                                                || <LocalDrinkIcon onClick={onClickWaterMark} />
                                                            }
                                                        </React.Fragment>
                                                    )
                                                }
                                            </Box>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6} lg={3}>
                                <Card className={classes.card}>
                                    <CardHeader title="Condiments" />
                                    <CardContent>
                                        <FormControl fullWidth className={classes.formControl}>
                                            <TextField variant="standard" type="number" label="Condiments" id="condiments" name="condiments" value={userDay.condiments ? userDay.condiments : ''} onChange={onChangeCondiments} disabled={postingDay} />
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>


                            <Grid item xs={12}>
                                <Card className={classes.card}>
                                    <CardHeader title="Notes" />
                                    <CardContent>
                                        <FormControl fullWidth>
                                            <TextField variant="standard" label="Notes" id="notes" name="notes" multiline rowsMax={3} value={userDay.notes || ''} onChange={onChangeNotes} disabled={postingDay} />
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>


                        <Box display="flex" justifyContent="flex-end">
                            <Box display="flex" alignItems="center" py={4}>
                                <Box mr={1} position="relative">
                                    <Button color="primary" onClick={onClickSave} disabled={postingDay}>Save</Button>
                                    {postingDay && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                                </Box>
                                <Box>
                                    <Button color="secondary" onClick={onClickReset} disabled={postingDay}>Reset</Button>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </React.Fragment>
            }
        </React.Fragment >
    );
}