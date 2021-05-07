import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { format, startOfToday } from 'date-fns';

import { DayView } from './components/day-view/day-view';
import { Plan } from './components/user-plan/plan';
import { FuelingRoutes } from './components/fuelings/fueling-routes';
import { NewUserRoutes } from './components/new-user/new-user-routes';
import { PlanRoutes } from './components/plans/plan-routes';
import { UserProvider } from './providers/user-provider';
import { Welcome } from './components/welcome';
import { Goals } from './components/goals/goals';
import { ApiProvider } from '../api';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(7),
            }
        }
    })
);

const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');

export const AppRoutes: React.FunctionComponent = () => {
    const classes = useStyles();
    const { isAuthenticated, isLoading } = useAuth0();


    if (isLoading) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress size='5rem' />
                <Box mt={4}>
                    <Typography variant="h5">Loading your road to success...</Typography>
                </Box>
            </Box>
        );
    }
    else if (isAuthenticated) {
        return (
            <Box className={classes.root}>
                <ApiProvider>
                    <Switch>
                        <Route path="/new-user" component={NewUserRoutes} />
                        <Route path="/fuelings" component={FuelingRoutes} />
                        <Route path="/plans" component={PlanRoutes} />
                        <UserProvider>
                            <Switch>
                                <Route path="/day/:day" component={DayView} />
                                <Route path="/plan" component={Plan} />
                                <Route path="/goals" component={Goals} />
                                <Redirect to={`/day/${dateToString(startOfToday())}`} />
                            </Switch>
                        </UserProvider>
                        <Redirect to={`/day/${dateToString(startOfToday())}`} />
                    </Switch>
                </ApiProvider>
            </Box>
        );
    }

    return <Welcome />
}
