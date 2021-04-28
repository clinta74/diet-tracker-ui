import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    Grid,
    Paper,
    TextField,
    Typography,
    FormLabel,
    makeStyles,
    Theme,
    createStyles,
    InputLabel,
    Input,
    Button,
    CircularProgress,
    IconButton
} from '@material-ui/core';
import clsx from 'clsx';
import { format, startOfToday, addDays, parseISO, getDay } from 'date-fns';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useCommonStyles } from '../common-styles';
import { Api } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { Link, useParams } from 'react-router-dom';

const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');

const useStyles = makeStyles((theme: Theme) => {
    const backgroundColors = ['plum', 'lightpink', 'Khaki', 'Aquamarine', 'Wheat', 'PowderBlue', 'Seashell'];

    return createStyles({
        activeLossGain: {
            color: theme.palette.error.main,
        },
        buttonProgress: {
            position: 'absolute',
            left: '-100%',
            marginTop: -12,
            marginLeft: -12,
        },
        paperBackground: {
            backgroundColor: (data: { dayOfWeek: number }) => backgroundColors[data.dayOfWeek],
        },
    });
});

interface Params {
    day: string;
}

export const DayView: React.FC = () => {
    const params = useParams<Params>();
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();

    const day = params.day ? parseISO(params.day) : startOfToday();
    // const [day, setDay] = useState<Date>(startOfToday());
    const [userDay, setUserDay] = useState<CurrentUserDay>();
    const [postingDay, setPostingDay] = useState(false);

    const classes = useStyles({ dayOfWeek: getDay(day) });


    useEffect(() => {

        Api.Day.getDay(dateToString(day))
            .then(({ data }) => setUserDay(data))
            .catch(error => alert.addMessage(error));
    }, [params]);

    const onChangeWater: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const water = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                water
            }
        });
    }

    const onChangeCondiments: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        const condiments = Math.max(0, Number(value));

        setUserDay(_userDay => {
            return {
                ..._userDay as CurrentUserDay,
                condiments
            }
        });
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
    }

    const onChangeFueling = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value, name } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    fuelings: [..._userDay.fuelings.slice(0, idx),
                    { ..._userDay.fuelings[idx], [name]: (name === 'when' ? `0001-01-01T${value}` : value) },
                    ..._userDay.fuelings.slice(idx + 1)],
                }
            }
        });
    }

    const onChangeMeal = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value, name } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    meals: [..._userDay.meals.slice(0, idx),
                    { ..._userDay.meals[idx], [name]: (name === 'when' ? `0001-01-01T${value}` : value) },
                    ..._userDay.meals.slice(idx + 1)],
                }
            }
        });
    }

    const onClickSave: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (userDay) {
            setPostingDay(true);
            Api.Day.updateDay(dateToString(day), userDay)
                .catch(error => alert.addMessage(error))
                .finally(() => setPostingDay(false));
        }
    }

    return (
        <Paper className={clsx([commonClasses.paper, classes.paperBackground])}>
            <Box mb={2}>
                <Typography variant="h4">{format(day, 'EEEE, MMM dd, yyyy')}</Typography>
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                        <Link to={`/day/${dateToString(addDays(day, -1))}`} className={commonClasses.link}>
                            <IconButton>
                                <ArrowBackIcon />
                            </IconButton>
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="flex" justifyContent="flex-end">
                            <Link to={`/day/${dateToString(addDays(day, 1))}`} className={commonClasses.link}>
                                <IconButton>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {
                userDay &&
                <React.Fragment>
                    <Grid container spacing={4}>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <TextField variant="standard" type="number" label="Weight" id="weight" name="weight" value={userDay.weight ? userDay.weight : ''} onChange={onChangeWeight} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <Box display="flex" alignItems="flex-end">
                                        <Box mr={1} mt={2} mb={-1}>
                                            <Box mb={-2}>
                                                <AddIcon fontSize="small" className={clsx({
                                                    [classes.activeLossGain]: userDay.weightChange < 0
                                                })} />
                                            </Box>
                                            <Box>
                                                <RemoveIcon fontSize="small" className={clsx({
                                                    [classes.activeLossGain]: userDay.weightChange > 0
                                                })} />
                                            </Box>
                                        </Box>
                                        <FormControl>
                                            <InputLabel>Loss/Gain</InputLabel>
                                            <Input value={userDay.weightChange ? Math.abs(userDay.weightChange) : ''} />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl>
                                        <InputLabel>Cumulative Weight</InputLabel>
                                        <Input value={userDay.cumulativeWeightChange ? userDay.cumulativeWeightChange : ''} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormLabel>Fuelings</FormLabel>
                            {
                                userDay.fuelings.map((fueling, idx) =>
                                    <Grid container spacing={2} key={`fueling_${idx}`}>
                                        <Grid item xs={7} md={8}>
                                            <FormControl fullWidth>
                                                <TextField value={fueling.name} name="name" onChange={e => onChangeFueling(e, idx)} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5} md={4}>
                                            <FormControl fullWidth>
                                                <TextField type="time" name="when" value={fueling.when === '0001-01-01T00:00:00' ? '' : fueling.when.split('T')[1]} onChange={e => onChangeFueling(e, idx)} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormLabel>Lean and Green</FormLabel>
                            {
                                userDay.meals.map((meal, idx) =>
                                    <Grid container spacing={2} key={meal.userMealId}>
                                        <Grid item xs={7} md={8}>
                                            <FormControl fullWidth>
                                                <TextField value={meal.name} name="name" onChange={e => onChangeMeal(e, idx)} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5} md={4}>
                                            <FormControl fullWidth>
                                                <TextField type="time" value={meal.when === '0001-01-01T00:00:00' ? '' : meal.when.split('T')[1]} name="when" onChange={e => onChangeMeal(e, idx)} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <TextField variant="standard" type="number" label="Water" id="water" name="water" value={userDay.water ? userDay.water : ''} onChange={onChangeWater} />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <TextField variant="standard" type="number" label="Condiments" id="condiments" name="condiments" value={userDay.condiments ? userDay.condiments : ''} onChange={onChangeCondiments} />
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={onClickSave} disabled={postingDay}>Save</Button>
                                {postingDay && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                            </Box>
                            <Box>
                                <Button color="secondary" disabled={postingDay}>Cancel</Button>
                            </Box>
                        </Box>
                    </Box>
                </React.Fragment>
            }
        </Paper>
    );
}