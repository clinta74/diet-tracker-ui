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
    IconButton,
    Divider,
} from '@material-ui/core';
import clsx from 'clsx';
import { format, startOfToday, addDays, parseISO, getDay } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useCommonStyles } from '../common-styles';
import { Api } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { Autocomplete } from '@material-ui/lab';

const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');

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
        },
        waterFill: {
            fill: 'blue'
        },
        expandIcon: {
            position: "absolute",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(128, 128, 128, 0.20)'
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
    const history = useHistory();

    const day = params.day ? parseISO(params.day) : startOfToday();
    const [userDay, setUserDay] = useState<CurrentUserDay>();
    const [fuelings, setFuelings ] = useState<Fueling[]>([]);
    const [postingDay, setPostingDay] = useState(false);

    const classes = useStyles({ dayOfWeek: getDay(day) });

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => setFuelings(data.sort((a, b) => a.name > b.name ? 1 : -1)))
            .catch(error => alert.addMessage(error));
    },[]);

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

    const onChangeFuelingName = (event: React.ChangeEvent<unknown>, value: string | null, idx: number) => {
        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
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
                    fuelings: [..._userDay.fuelings.slice(0, idx),
                    { ..._userDay.fuelings[idx], when: value ? `0001-01-01T${value}` : `0001-01-01T00:00:00` },
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

    const onChangeNotes: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
        const { value } = event.target;

        setUserDay(_userDay => {
            if (_userDay) {
                return {
                    ..._userDay as CurrentUserDay,
                    notes: value || '',
                }
            }
        });
    }

    const onClickSave = async () => {
        if (userDay) {
            setPostingDay(true);
            try {
                const { data } = await Api.Day.updateDay(dateToString(day), userDay);
                setUserDay(data);
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
            .then(({ data }) => setUserDay(data))
            .catch(error => alert.addMessage(error));
    }

    const waterTarget = 64;
    const waterSize = 8;
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

    return (
        <Paper className={clsx([commonClasses.paper, classes.paperBackground])}>
            <Box display="flex" alignItems="center">
                <IconButton onClick={onClickPrevDay}>
                    <ArrowBackIcon />
                </IconButton>

                <Box flexGrow={1} textAlign="center">
                    <Typography variant="h4">{format(day, 'EEEE, MMM dd, yyyy')}</Typography>
                </Box>

                <IconButton onClick={onClickNextDay}>
                    <ArrowForwardIcon />
                </IconButton>
            </Box>

            <Divider className={commonClasses.divider} />
            {
                userDay &&
                <React.Fragment>
                    <Grid container spacing={4}>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <TextField variant="standard" type="number" label="Weight" id="weight" name="weight" value={userDay.weight ? userDay.weight : ''} onChange={onChangeWeight} disabled={postingDay} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4} sm={3}>
                                    <Box display="flex" alignItems="flex-end">
                                        <Box mr={1} mt={2} mb={-1}>
                                            <Box mb={-2}>
                                                <AddIcon fontSize="small" className={clsx({
                                                    [classes.activeLossGain]: userDay.weightChange > 0
                                                })} />
                                            </Box>
                                            <Box>
                                                <RemoveIcon fontSize="small" className={clsx({
                                                    [classes.activeLossGain]: userDay.weightChange < 0
                                                })} />
                                            </Box>
                                        </Box>
                                        <FormControl>
                                            <InputLabel>Loss/Gain</InputLabel>
                                            <Input readOnly value={userDay.weightChange ? Math.abs(userDay.weightChange) : ''} />
                                        </FormControl>
                                    </Box>
                                </Grid>

                                <Grid item xs={4} sm={3}>
                                    <FormControl>
                                        <InputLabel>Cumulative</InputLabel>
                                        <Input readOnly value={userDay.cumulativeWeightChange ? userDay.cumulativeWeightChange : ''} />
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
                                                <Autocomplete
                                                    freeSolo
                                                    options={fuelings.map(fueling => fueling.name)}
                                                    value={fueling.name}
                                                    onChange={(e, v) => onChangeFuelingName(e, v, idx)}
                                                    disabled={postingDay}
                                                    renderInput={(params) => (
                                                        <TextField {...params} name="name" />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5} md={4}>
                                            <FormControl fullWidth>
                                                <TextField type="time" name="when" value={fueling.when === '0001-01-01T00:00:00' ? '' : fueling.when.split('T')[1]} onChange={e => onChangeFuelingWhen(e, idx)} disabled={postingDay} />
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
                                    <Grid container spacing={2} key={`meal_${idx}`}>
                                        <Grid item xs={7} md={8}>
                                            <FormControl fullWidth>
                                                <TextField value={meal.name} name="name" onChange={e => onChangeMeal(e, idx)} disabled={postingDay} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5} md={4}>
                                            <FormControl fullWidth>
                                                <TextField type="time" value={meal.when === '0001-01-01T00:00:00' ? '' : meal.when.split('T')[1]} name="when" onChange={e => onChangeMeal(e, idx)} disabled={postingDay} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
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
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <TextField variant="standard" type="number" label="Condiments" id="condiments" name="condiments" value={userDay.condiments ? userDay.condiments : ''} onChange={onChangeCondiments} disabled={postingDay} />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField variant="standard" label="Notes" id="notes" name="notes" multiline rowsMax={3} value={userDay.notes || ''} onChange={onChangeNotes} disabled={postingDay} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1} position="relative">
                                <Button color="primary" onClick={onClickSave} disabled={postingDay}>Save</Button>
                                {postingDay && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                            </Box>
                            <Box>
                                <Button color="secondary" onClick={onClickReset} disabled={postingDay}>Reset</Button>
                            </Box>
                        </Box>
                    </Box>
                </React.Fragment>
            }
        </Paper>
    );
}