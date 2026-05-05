import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress, Theme, Typography } from '@mui/material';
import { createStyles, makeStyles } from "@mui/styles";

import { FuelingRoutes } from './components/fuelings/fueling-routes';
import { NewUserRoutes } from './components/new-user/new-user-routes';
import { PlanRoutes } from './components/plans/plan-routes';
import { ApiProvider } from '../api';
import { UserRoutes } from './components/user/user-routes';
import { LegalRoutes } from './components/legal/legal-routes';
import { useAuth } from '../auth/use-auth';
import { LoginPage } from './components/auth/login-page';
import { MigratePage } from './components/auth/migrate-page';
import { AccountSettingsPage } from './components/account/account-settings-page';
import { AdminUsersPage } from './components/admin/admin-users-page';
import { Authorized } from './providers/user-permission-provider';

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
    const { isAuthenticated, isLoading } = useAuth();

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

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/migrate" element={<MigratePage />} />
                <Route path="/legal/*" element={<LegalRoutes />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <Box className={classes.root}>
            <ApiProvider>
                <Routes>
                    <Route path="/new-user/*" element={<NewUserRoutes />} />
                    <Route path="/fuelings/*" element={<FuelingRoutes />} />
                    <Route path="/plans/*" element={<PlanRoutes />} />
                    <Route path="/legal/*" element={<LegalRoutes />} />
                    <Route path="/settings/account" element={<AccountSettingsPage />} />
                    <Route path="/admin/users" element={
                        <Authorized permissions="admin:users">
                            <AdminUsersPage />
                        </Authorized>
                    } />
                    <Route path="/*" element={<UserRoutes />} />
                </Routes>
            </ApiProvider>
        </Box>
    );
}
