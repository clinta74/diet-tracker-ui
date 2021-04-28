import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { apiBase } from '../api/api-base';
import { DayView } from './components/day-view/day-view';
import { FuelingRoutes } from './components/fuelings/fueling-routes';
import { NewUserRoutes } from './components/new-user/new-user-routes';
import { PlanRoutes } from './components/plans/plan-routes';
import { UserProvider } from './providers/user-provider';
import { Welcome } from './components/welcome';
import { format, startOfToday } from 'date-fns';

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
    const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
    const [hasToken, setHasToken] = useState<boolean>(false);

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently()
                .then((token) => {
                    apiBase.setAuthToken(token);
                    setHasToken(true);
                });
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    if (isLoading || !hasToken && isAuthenticated) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress size='5rem' />
                <Box mt={4}>
                    <Typography variant="h5">Loading your road to success...</Typography>
                </Box>
            </Box>
        );
    }
    else if (isAuthenticated && hasToken) {
        return (
            <Box className={classes.root}>
                <Switch>
                    <Route path="/new-user" component={NewUserRoutes} />
                    <Route path="/fuelings" component={FuelingRoutes} />
                    <Route path="/plans" component={PlanRoutes} />
                    <UserProvider>
                        <Switch>
                            <Route path="/day/:day" component={DayView} />
                            <Redirect to={`/day/${dateToString(startOfToday())}`} />
                        </Switch>
                    </UserProvider>
                    <Redirect to={`/day/${dateToString(startOfToday())}`} />
                </Switch>
            </Box>
        );
    }

    return <Welcome />
}
