import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Theme, Typography } from '@mui/material';
import { createStyles, makeStyles } from "@mui/styles";
import { startOfToday } from 'date-fns';

import { FuelingRoutes } from './components/fuelings/fueling-routes';
import { NewUserRoutes } from './components/new-user/new-user-routes';
import { PlanRoutes } from './components/plans/plan-routes';
import { UserProvider } from './providers/user-provider';
import { Welcome } from './components/welcome';
import { ApiProvider } from '../api';
import { dateToString } from '../utils/date-to-string';
import { UserRoutes } from './components/user/user-routes';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(7),
            }
        }
    })
);

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
                    <Routes>
                        <Route path="/new-user/*" element={<NewUserRoutes />} />
                        <Route path="/fuelings/*" element={<FuelingRoutes />} />
                        <Route path="/plans/*" element={<PlanRoutes />} />
                        <Route path="/*" element={<UserRoutes />} />
                    </Routes>
                </ApiProvider>
            </Box>
        );
    }

    return <Welcome />
}
