import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    SpeedDial,
    SpeedDialAction
} from '@mui/material';
import {
    format,
    addDays,
    parseISO,
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

import { commonSx } from '../../common-styles';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';
import { useUser } from '../../../providers/user-provider';
import { NumberTrackingCard } from '../tracking-card';
import { VictoriesCard } from '../victories-card';
import { VictoryType } from '../../../../api/endpoints/victory';
import { GraphModal } from '../graph-modal';
import { DayFuelings } from './day-fuelings';
import { UserDayProvider, useUserDay } from './user-day-provider';
import { DayMeals } from './day-meals';

export const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');
const backgroundColors = ['plum', 'lightpink', 'khaki', 'aquamarine', 'wheat', 'powderblue', 'seashell'];

interface ChartData {
    values?: GraphValue[];
    name?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
}

const graphButtonSx = (theme: Theme) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
});

export const DayView: React.FC = () => {
    return (
        <UserDayProvider>
            <UserDay />
        </UserDayProvider>
    );
}

const UserDay: React.FC = () => {
    const alert = useAlertMessage();
    const navigate = useNavigate();
    const { Api } = useApi();
    const { user } = useUser();
    const {
        day,
        dayStr,
        userDay,
        victories,
        trackingValues,
        setUserDay,
        loadValues,
        saveValues,
        isLoading,
        cancel,
        setUserFuelings,
        setUserMeals,
        setVictories,
        setTrackingValues,
        isPosting,
        setIsPosting,
    } = useUserDay();

    const [open, setOpen] = useState(false);
    const [graphOpen, setGraphOpen] = useState(false);
    const [trackings, setTrackings] = useState<UserTracking[]>([]);
    const [chartData, setChartData] = useState<ChartData>();


    useEffect(() => {
        loadValues();
        Api.UserTracking.getActiveUserTrackings()
            .then(({ data }) => setTrackings(data))
            .catch(error => alert.addMessage(error));
    }, [day]);

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
    }

    const onClickWaterMark = (idx: number) => {
        setUserDay(_userDay => {
            if (_userDay) {
                const water = (_userDay.water - _userDay.water % waterSize) <= (waterSize * idx + 1) ? _userDay.water + waterSize - _userDay.water % waterSize : _userDay.water - waterSize - _userDay.water % waterSize;
                return {
                    ..._userDay,
                    water,
                }
            }
        });
    }

    const onChangeTrackingValues = (values: UserDailyTrackingValue[]) => {
        setTrackingValues(trackingValues => {
            const filtered = trackingValues.filter(tv => !values.some(v => v.userTrackingValueId === tv.userTrackingValueId && v.occurrence === tv.occurrence));
            return [
                ...filtered,
                ...values,
            ]
        });
    }

    const onChangeVictories = (victories: Victory[]) => {
        setVictories([...victories]);
    }

    // Save and reset calls
    const onClickSave = async () => {
        cancel();
        setIsPosting(true);
        try {
            await saveValues();
        }
        catch (error) {
            alert.addMessage(error);
        }
        finally {
            setIsPosting(false);
        }
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
            }, false);
        }
        handleClose();
    }

    const onClickAddVictory: React.MouseEventHandler<HTMLDivElement> = () => {
        setVictories(_victories => [
            ..._victories,
            {
                userId: '',
                victoryId: 0,
                name: '',
                when: dayStr,
                type: VictoryType.NonScale,
            }
        ], false);
        handleClose();
    }

    const onClickAddFueling: React.MouseEventHandler<HTMLDivElement> = () => {
        setUserFuelings(_userFuelings => [
            ..._userFuelings,
            {
                userId: '',
                userFuelingId: 0,
                name: '',
                day: dayStr,
                when: null
            }
        ], false);
        handleClose();
    }

    const onClickAddMeal: React.MouseEventHandler<HTMLDivElement> = () => {
        setUserMeals(_userMeals => [
            ..._userMeals,
            {
                userId: '',
                userMealId: 0,
                name: '',
                day: dayStr,
                when: null

            }
        ], false);
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
        cancel();
        await onClickSave();
        navigate(`/day/${dateToString(addDays(day, 1))}`);
    }

    const onClickPrevDay = async () => {
        cancel();
        await onClickSave();
        navigate(`/day/${dateToString(addDays(day, -1))}`);
    }

    const dateText = formatDistanceToNowStrict(day, { addSuffix: true, unit: 'day', roundingMethod: 'floor' });
    const formatDateText: { [key: string]: string } = {
        '0 days ago': 'today',
        'in 0 days': 'tomorrow',
    }

    const waterTarget = user.waterTarget || 64;
    const waterSize = user.waterSize || 8;
    const waterMarks: boolean[] = new Array(Math.ceil(waterTarget / waterSize));
    if (userDay) {
        const end = Math.floor(userDay.water / waterSize);
        waterMarks.fill(false);
        waterMarks.fill(true, 0, end);
    }

    return (
        <React.Fragment>
            <Box>
                <Paper sx={{ ...commonSx.paper, bgcolor: backgroundColors[day.getDay()], mb: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center"
                        }}>
                        <IconButton onClick={onClickPrevDay}>
                            <ArrowBackIcon />
                        </IconButton>

                        <Box
                            sx={{
                                flexGrow: 1,
                                textAlign: "center"
                            }}>
                            <Typography variant="h4">
                                {format(day, 'EEEE')}
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{format(day, ', MMM dd')}</Box>
                                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>{format(day, ', yyyy')}</Box>
                            </Typography>
                            <Box sx={{
                                textAlign: "center"
                            }}>{formatDateText[dateText] || dateText}</Box>
                        </Box>

                        <IconButton onClick={onClickNextDay}>
                            <ArrowForwardIcon />
                        </IconButton>
                    </Box>
                </Paper>
                {
                    isLoading && <Box sx={{
                        position: "relative"
                    }}><Box sx={{ top: '-10px', width: '100%', position: 'absolute' }}><LinearProgress /></Box></Box>
                }
            </Box>
            {
                userDay &&
                <React.Fragment>
                    <form noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <DayFuelings />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <DayMeals />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <Card sx={commonSx.card}>
                                    <Box sx={graphButtonSx}>
                                        <IconButton size="small" onClick={onClickShowWeightGraph}>
                                            <BarChartOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                    <CardHeader title="Weight" subheader="Keep track of your weight when you want." />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid
                                                size={{
                                                    xs: 12,
                                                    md: 6
                                                }}>
                                                <FormControl fullWidth>
                                                    <TextField variant="standard" type="number" label="Weight" id="weight" name="weight" value={userDay.weight ? userDay.weight : ''} onChange={onChangeWeight} disabled={isPosting} />
                                                </FormControl>
                                            </Grid>


                                            <Grid
                                                size={{
                                                    xs: 6,
                                                    md: 3
                                                }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "flex-end"
                                                    }}>
                                                    <Box
                                                        sx={{
                                                            mr: 1,
                                                            mt: 2,
                                                            mb: -1
                                                        }}>
                                                        <Box sx={{
                                                            mb: -2
                                                        }}>
                                                            <RemoveIcon fontSize="small" sx={{ color: userDay.weightChange < 0 ? 'text.disabled' : 'green' }} />
                                                        </Box>
                                                        <Box>
                                                            <AddIcon fontSize="small" sx={{ color: userDay.weightChange > 0 ? 'text.disabled' : 'red' }} />
                                                        </Box>
                                                    </Box>
                                                    <FormControl fullWidth >
                                                        <InputLabel>Loss/Gain</InputLabel>
                                                        <Input readOnly value={Math.abs(userDay.weightChange)} />
                                                    </FormControl>
                                                </Box>
                                            </Grid>

                                            <Grid
                                                size={{
                                                    xs: 6,
                                                    md: 3
                                                }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Cumulative</InputLabel>
                                                    <Input readOnly value={userDay.cumulativeWeightChange} />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <Card sx={commonSx.card}>
                                    <Box sx={graphButtonSx}>
                                        <IconButton size="small" onClick={onClickShowWaterGraph}>
                                            <BarChartOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                    <CardHeader title="Water" subheader="How much water have you been drinking?" />
                                    <CardContent>
                                        <Box sx={{
                                            display: "flex"
                                        }}>
                                            <Box sx={{
                                                mr: 2
                                            }}>
                                                {
                                                    waterMarks.map((mark, idx) =>
                                                        <React.Fragment key={idx}>
                                                            {
                                                                mark && <LocalDrinkIcon fontSize="large" onClick={() => onClickWaterMark(idx)} sx={{ fill: 'blue !important' }} />
                                                                || <LocalDrinkIcon fontSize="large" onClick={() => onClickWaterMark(idx)} />
                                                            }
                                                        </React.Fragment>
                                                    )
                                                }
                                            </Box>
                                            <FormControl>
                                                <TextField variant="standard" type="number" label="Water" id="water" name="water" value={userDay.water ? userDay.water : ''} onChange={onChangeWater} disabled={isPosting} />
                                            </FormControl>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={12}>
                                <Grid container spacing={2} sx={{
                                    justifyContent: "center"
                                }}>
                                    {
                                        trackings.length > 0 &&
                                        trackings.map(tracking => {
                                            const userTrackingValueIds = tracking.values ? tracking.values.map(v => v.userTrackingValueId) : [];
                                            const values = trackingValues.filter(value => userTrackingValueIds.includes(value.userTrackingValueId))
                                            return (
                                                <Grid
                                                    key={`tracking-${tracking.userTrackingId}`}
                                                    size={{
                                                        xs: 12,
                                                        sm: tracking.useTime ? 12 : 6,
                                                        md: tracking.useTime ? 4 : 3,
                                                        xl: 3
                                                    }}>
                                                    <NumberTrackingCard tracking={tracking} values={values} onChange={onChangeTrackingValues} disable={isPosting} />
                                                </Grid>
                                            );
                                        })
                                    }
                                </Grid>
                            </Grid>

                            <Grid size={12}>
                                <Grid container spacing={2} sx={{
                                    justifyContent: "center"
                                }}>
                                    {
                                        victories.length > 0 &&
                                        <Grid
                                            size={{
                                                xs: 12,
                                                md: 6
                                            }}>
                                            <VictoriesCard victories={victories} disable={isPosting} onChange={onChangeVictories} />
                                        </Grid>
                                    }

                                    {
                                        userDay.notes !== null &&
                                        <Grid
                                            size={{
                                                xs: 12,
                                                md: 6
                                            }}>
                                            <Card sx={commonSx.card}>
                                                <CardHeader title="Notes" subheader="What happened today that you would like to remember?" />
                                                <CardContent>
                                                    <FormControl fullWidth>
                                                        <TextField variant="standard" label="Notes" id="notes" name="notes" multiline maxRows={3} value={userDay.notes || ''} onChange={onChangeNotes} disabled={isPosting} />
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>


                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center"
                            }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    py: 4
                                }}>
                                <Box
                                    sx={{
                                        mr: 1,
                                        position: "relative"
                                    }}>
                                    <Button color="primary" onClick={onClickSave} disabled={isPosting}>Save</Button>
                                    {isPosting && <CircularProgress size={24} sx={commonSx.buttonProgress}></CircularProgress>}
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    position: "relative",
                                    height: "56px",
                                    width: "56px"
                                }}>
                                <SpeedDial
                                    sx={{ position: 'absolute', bottom: 0, right: 0 }}
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
                                        slotProps={{ tooltip: { title: 'Add Victory' } }}
                                        onClick={onClickAddVictory}
                                    />

                                    {
                                        userDay.notes === null &&
                                        <SpeedDialAction
                                            key="add-notes"
                                            icon={<NoteOutlinedIcon />}
                                            slotProps={{ tooltip: { title: 'Add Notes' } }}
                                            onClick={onClickAddNote}
                                        />
                                    }

                                    <SpeedDialAction
                                        key="add-fueling"
                                        icon={<ShoppingBasketIcon />}
                                        slotProps={{ tooltip: { title: 'Add Fueling' } }}
                                        onClick={onClickAddFueling}
                                    />

                                    <SpeedDialAction
                                        key="add-meals"
                                        icon={<RestaurantOutlinedIcon />}
                                        slotProps={{ tooltip: { title: 'Add Lean and Green' } }}
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
