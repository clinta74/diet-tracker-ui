import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
    Box,
    FormControl,
    Grid,
    Paper,
    TextField,
    Typography,
    Theme,
    InputLabel,
    Input,
    Button,
    CircularProgress,
    IconButton,
    Hidden,
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    SpeedDial, 
    SpeedDialAction
} from '@mui/material';
import {
    format,
    startOfToday,
    addDays,
    parseISO,
    getDay,
    formatDistanceToNowStrict,
} from 'date-fns';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalDrinkIcon from '@mui/icons-material/LocalDrinkOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasketOutlined';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

import { useCommonStyles } from '../common-styles';
import { useApi } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { Autocomplete, createFilterOptions } from '@mui/material';
import { useUser } from '../../providers/user-provider';
import { NumberTrackingCard } from './tracking-card';
import { VictoriesCard } from './victories-card';
import { VictoryType } from '../../../api/endpoints/victory';
import { GraphModal } from './graph-modal';
import { useDebounce } from 'react-use';
import { makeStyles, createStyles } from '@mui/styles';

const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');

const useStyles = makeStyles((theme: Theme) => {
    const backgroundColors = ['plum', 'lightpink', 'Khaki', 'Aquamarine', 'Wheat', 'PowderBlue', 'Seashell'];

    return createStyles({
        weightLoss: {
            color: 'green',
        },
        weightGain: {
            color: 'red',
        },
        inactiveLossGain: {
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
            position: 'relative',
        },
        formControl: {
            marginBottom: theme.spacing(1),
        },
        autoSave: {
            position: 'absolute',
            right: theme.spacing(4),
            top: theme.spacing(6),
            zIndex: theme.zIndex.appBar + 1,
        },
        speedDial: {
            position: 'absolute',
            bottom: 0,
            right: 0,
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
        loader: {
            top: '-10px',
            width: '100%',
            position: 'absolute',
        }
    });
});

interface ChartData {
    values?: GraphValue[];
    name?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
}
interface Params {
    day: string;
}

export const DayView: React.FC = () => {
    const params = useParams<Params>();
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const history = useHistory();
    const { Api } = useApi();
    const { user } = useUser();

    const [open, setOpen] = useState(false);
    const [graphOpen, setGraphOpen] = useState(false);
    const [day, setDay] = useState<Date>(startOfToday());
    const [userDay, setUserDay] = useState<CurrentUserDay>();
    const [hasChanged, setHasChanged] = useState(false);
    const [fuelings, setFuelings] = useState<Fueling[]>([]);
    const [postingDay, setPostingDay] = useState(false);
    const [trackings, setTrackings] = useState<UserTracking[]>([]);
    const [trackingValues, setTrackingValues] = useState<UserDailyTrackingValue[]>([]);
    const [chartData, setChartData] = useState<ChartData>();
    const [isLoading, setIsLoading] = useState(false);

    const classes = useStyles({ dayOfWeek: getDay(day) });
    const timeout = 2000;

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => setFuelings(data.sort((a, b) => a.name > b.name ? 1 : -1)))
            .catch(error => alert.addMessage(error));
        Api.UserTracking.getActiveUserTrackings()
            .then(({ data }) => setTrackings(data))
            .catch(error => alert.addMessage(error));
    }, []);

    useEffect(() => {
        const day = params.day ? parseISO(params.day) : startOfToday();
        setDay(day);
        loadValues(day);
    }, [params]);


    const [cancel] = useDebounce(() => {
        if (userDay && hasChanged) {
            console.log('Autosave', new Date());
            saveValues();
        }
    }, timeout, [userDay, trackingValues]);

    const loadValues = (day: Date) => {
        cancel();
        setIsLoading(true);
        Promise.all([
            Api.Day.getDay(dateToString(day)),
            Api.UserDailyTracking.getUserDailyTrackingValues(dateToString(day))
        ])
            .then(([currentUserDay, userDailyTracking]) => {
                setUserDay(currentUserDay.data);
                setTrackingValues(userDailyTracking.data)
            })
            .catch(error => alert.addMessage(error))
            .finally(() => {
                setIsLoading(false);
            });
    }
    const saveValues = async () => {
        try {
            if (userDay) {
                setHasChanged(false);
                const { data } = await Api.Day.updateDay(dateToString(day), userDay);
                setUserDay(data);
                cancel();
                const values = trackingValues.map(({ userTrackingValueId, occurrence, value, when }) => ({
                    userTrackingValueId,
                    occurrence,
                    value,
                    when,
                }));
                await Api.UserDailyTracking.updateUserDailyTrackingValue(dateToString(day), values);
            }
        }
        catch (error) {
            alert.addMessage(error);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const onChangeWater: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const water = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                water
            }
        });
        setHasChanged(true);
    }

    const onChangeWeight: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const weight = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                weight
            }
        });
        setHasChanged(true);
    }

    const onChangeFuelingName = (event: React.ChangeEvent<unknown>, value: string | null, idx: number) => {
        if (userDay && userDay.fuelings[idx].name !== value) {
            setUserDay(_userDay => {
                if (_userDay) {
                    return {
                        ..._userDay,
                        fuelings: [..._userDay.fuelings.slice(0, idx),
                        {
                            ..._userDay.fuelings[idx],
                            name: value || '',
                        },
                        ..._userDay.fuelings.slice(idx + 1)],
                    }
                }
            });
            setHasChanged(true);
        }
    }

    const onChangeFuelingWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay,
                    fuelings: [..._userDay.fuelings.slice(0, idx),
                    {
                        ..._userDay.fuelings[idx],
                        when: value ? `0001-01-01T${value}` : null,
                    },
                    ..._userDay.fuelings.slice(idx + 1)],
                }
            }
        });
        setHasChanged(true);
    }

    const onChangeMealName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay,
                    meals: [..._userDay.meals.slice(0, idx),
                    {
                        ..._userDay.meals[idx],
                        name: value || '',
                    },
                    ..._userDay.meals.slice(idx + 1)],
                }
            }
        });
        setHasChanged(true);
    }

    const onChangeMealWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay,
                    meals: [..._userDay.meals.slice(0, idx),
                    {
                        ..._userDay.meals[idx],
                        when: value ? `0001-01-01T${value}` : null,
                    },
                    ..._userDay.meals.slice(idx + 1)],
                }
            }
        });
        setHasChanged(true);
    }

    const onChangeNotes: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay,
                    notes: value || '',
                }
            }
        });
        setHasChanged(true);
    }

    const waterTarget = user.waterTarget || 64;
    const waterSize = user.waterSize || 8;
    const waterMarks: boolean[] = new Array(Math.ceil(waterTarget / waterSize));
    if (userDay) {
        const end = Math.floor(userDay.water / waterSize);
        waterMarks.fill(false);
        waterMarks.fill(true, 0, end);
    }

    const onClickWaterMark = (event: React.MouseEvent, idx: number) => {
        setUserDay(_userDay => {
            if (_userDay) {
                const water = (_userDay.water - _userDay.water % waterSize) <= (waterSize * idx + 1) ? _userDay.water + waterSize - _userDay.water % waterSize : _userDay.water - waterSize - _userDay.water % waterSize;
                return {
                    ..._userDay,
                    water,
                }
            }
        });
        setHasChanged(true);
    }

    const onChangeTrackingValues = (values: UserDailyTrackingValue[]) => {
        setTrackingValues(trackingValues => {
            const filtered = trackingValues.filter(tv => !values.some(v => v.userTrackingValueId === tv.userTrackingValueId && v.occurrence === tv.occurrence));
            return [
                ...filtered,
                ...values,
            ]
        });
        setHasChanged(true);
    }

    const onChangeVictories = (victories: Victory[]) => {

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay,
                    victories: [...victories],
                }
            }
        });
        setHasChanged(true);
    }

    // Save and reset calls
    const onClickSave = async () => {
        if (userDay && hasChanged) {
            cancel();
            setPostingDay(true);
            try {
                await saveValues();
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
        loadValues(day);
    }

    const onClickAddNote: React.MouseEventHandler<HTMLDivElement> = () => {
        if (!userDay?.notes) {
            setUserDay(_userDay => {
                if (_userDay) {
                    return ({
                        ..._userDay,
                        notes: '',
                    });
                }
            });
        }
        handleClose();
    }

    const onClickAddVictory: React.MouseEventHandler<HTMLDivElement> = () => {
        setUserDay(_userDay => {
            if (_userDay) {
                const victories: Victory[] = [
                    ..._userDay.victories,
                    {
                        userId: '',
                        victoryId: 0,
                        name: '',
                        when: dateToString(day),
                        type: VictoryType.NonScale,
                    }
                ]
                return ({
                    ..._userDay,
                    victories,
                });
            }
        });
        handleClose();
    }

    const onClickAddFueling: React.MouseEventHandler<HTMLDivElement> = () => {
        setUserDay(_userDay => {
            if (_userDay) {
                const fuelings: UserFueling[] = [
                    ..._userDay.fuelings,
                    {
                        userId: '',
                        userFuelingId: 0,
                        name: '',
                        day: dateToString(day),
                        when: null

                    }
                ]
                return ({
                    ..._userDay,
                    fuelings,
                });
            }
        });
        handleClose();
    }

    const onClickAddMeal: React.MouseEventHandler<HTMLDivElement> = () => {
        setUserDay(_userDay => {
            if (_userDay) {
                const meals: UserMeal[] = [
                    ..._userDay.meals,
                    {
                        userId: '',
                        userMealId: 0,
                        name: '',
                        day: dateToString(day),
                        when: null

                    }
                ]
                return ({
                    ..._userDay,
                    meals,
                });
            }
        });
        handleClose();
    }

    const onClickShowWeightGraph = () => {
        Api.Day.getWeightGraphValues(dateToString(addDays(day, -14)))
            .then(({ data }) => {
                const values = data.map(({ value, date }) => ({
                    value,
                    date: format(parseISO(date), 'M/d')
                }));

                setChartData({
                    name: 'weight',
                    title: 'Your Weigh-In History',
                    values,
                });

                setGraphOpen(true);
            });
    }

    const onClickShowWaterGraph = () => {
        Api.Day.getWaterGraphValue(dateToString(addDays(day, -14)))
            .then(({ data }) => {
                const values = data.map(({ value, date }) => ({
                    value,
                    date: format(parseISO(date), 'M/d')
                }));

                setChartData({
                    name: 'water',
                    title: 'Your Water Drinking History',
                    values,
                });

                setGraphOpen(true);
            });
    }

    const onCloseGraph = () => {
        setGraphOpen(false);
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
            <Box>
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
                    isLoading && <Box position="relative"><Box className={classes.loader}><LinearProgress /></Box></Box>
                }
            </Box>
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
                                    <Box className={classes.graphButton}>
                                        <IconButton size="small" onClick={onClickShowWeightGraph}>
                                            <BarChartOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                    <CardHeader title="Weight" subheader="Keep track of your weight when you want." />
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
                                                            <RemoveIcon fontSize="small" className={clsx(classes.weightLoss, {
                                                                [classes.inactiveLossGain]: userDay.weightChange < 0
                                                            })} />
                                                        </Box>
                                                        <Box>
                                                            <AddIcon fontSize="small" className={clsx(classes.weightGain, {
                                                                [classes.inactiveLossGain]: userDay.weightChange > 0
                                                            })} />
                                                        </Box>
                                                    </Box>
                                                    <FormControl fullWidth >
                                                        <InputLabel>Loss/Gain</InputLabel>
                                                        <Input readOnly value={Math.abs(userDay.weightChange)} />
                                                    </FormControl>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={6} md={3}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Cumulative</InputLabel>
                                                    <Input readOnly value={userDay.cumulativeWeightChange} />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card className={classes.card}>
                                    <Box className={classes.graphButton}>
                                        <IconButton size="small" onClick={onClickShowWaterGraph}>
                                            <BarChartOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                    <CardHeader title="Water" subheader="How much water have you been drinking?" />
                                    <CardContent>
                                        <Box display="flex">
                                            <Box mr={2}>
                                                {
                                                    waterMarks.map((mark, idx) =>
                                                        <React.Fragment key={idx}>
                                                            {
                                                                mark && <LocalDrinkIcon fontSize="large" onClick={e => onClickWaterMark(e, idx)} className={classes.waterFill} />
                                                                || <LocalDrinkIcon fontSize="large" onClick={e => onClickWaterMark(e, idx)} />
                                                            }
                                                        </React.Fragment>
                                                    )
                                                }
                                            </Box>
                                            <FormControl>
                                                <TextField variant="standard" type="number" label="Water" id="water" name="water" value={userDay.water ? userDay.water : ''} onChange={onChangeWater} disabled={postingDay} />
                                            </FormControl>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} >
                                <Grid container spacing={2} justifyContent="center">
                                    {
                                        trackings.length > 0 &&
                                        trackings.map(tracking => {
                                            const userTrackingValueIds = tracking.values ? tracking.values.map(v => v.userTrackingValueId) : [];
                                            const values = trackingValues.filter(value => userTrackingValueIds.includes(value.userTrackingValueId))
                                            return (
                                                <Grid item xs={12} sm={tracking.useTime ? 12 : 6} md={tracking.useTime ? 4 : 3} xl={3} key={`tracking-${tracking.userTrackingId}`}>
                                                    <NumberTrackingCard tracking={tracking} values={values} onChange={onChangeTrackingValues} disable={postingDay} />
                                                </Grid>
                                            );
                                        })
                                    }
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2} justifyContent="center">
                                    {
                                        userDay.victories.length > 0 &&
                                        <Grid item xs={12} md={6}>
                                            <VictoriesCard victories={userDay.victories} disable={postingDay} onChange={onChangeVictories} />
                                        </Grid>
                                    }

                                    {
                                        userDay.notes !== null &&
                                        <Grid item xs={12} md={6}>
                                            <Card className={classes.card}>
                                                <CardHeader title="Notes" subheader="What happened today that you would like to remember?" />
                                                <CardContent>
                                                    <FormControl fullWidth>
                                                        <TextField variant="standard" label="Notes" id="notes" name="notes" multiline maxRows={3} value={userDay.notes || ''} onChange={onChangeNotes} disabled={postingDay} />
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>


                        <Box display="flex" justifyContent="flex-end" alignItems="center">
                            <Box display="flex" alignItems="center" py={4}>
                                <Box mr={1} position="relative">
                                    <Button color="primary" onClick={onClickSave} disabled={postingDay}>Save</Button>
                                    {postingDay && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                                </Box>
                                <Box mr={1}>
                                    <Button color="secondary" onClick={onClickReset} disabled={postingDay}>Reset</Button>
                                </Box>
                            </Box>
                            <Box position="relative" height="56px" width="56px">
                                <SpeedDial
                                    className={classes.speedDial}
                                    ariaLabel="Day Speed dial"
                                    icon={<SpeedDialIcon />}
                                    onClose={handleClose}
                                    onOpen={handleOpen}
                                    open={open}
                                    direction="up"
                                >
                                    <SpeedDialAction
                                        key="add-victory"
                                        icon={<CakeOutlinedIcon />}
                                        tooltipTitle="Add Victory"
                                        onClick={onClickAddVictory}
                                    />

                                    {
                                        userDay.notes === null &&
                                        <SpeedDialAction
                                            key="add-notes"
                                            icon={<NoteOutlinedIcon />}
                                            tooltipTitle="Add Notes"
                                            onClick={onClickAddNote}
                                        />
                                    }

                                    <SpeedDialAction
                                        key="add-fueling"
                                        icon={<ShoppingBasketIcon />}
                                        tooltipTitle="Add Fueling"
                                        onClick={onClickAddFueling}
                                    />

                                    <SpeedDialAction
                                        key="add-meals"
                                        icon={<RestaurantOutlinedIcon />}
                                        tooltipTitle="Add Lean and Green"
                                        onClick={onClickAddMeal}
                                    />
                                </SpeedDial>
                            </Box>
                        </Box>
                    </form>
                    <GraphModal open={graphOpen} onClose={onCloseGraph} values={chartData?.values} name={chartData?.name} title={chartData?.title} />
                </React.Fragment>
            }
        </React.Fragment >
    );
}
