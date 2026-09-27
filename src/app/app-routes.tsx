import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import { FuelingRoutes } from './components/fuelings/fueling-routes';
import { NewUserRoutes } from './components/new-user/new-user-routes';
import { PlanRoutes } from './components/plans/plan-routes';
import { ApiProvider } from '../api';
import { UserRoutes } from './components/user/user-routes';
import { LegalRoutes } from './components/legal/legal-routes';
import { useAuth } from '../auth/use-auth';
import { LoginPage } from './components/auth/login-page';
import { AccountSettingsPage } from './components/account/account-settings-page';
import { AdminUsersPage } from './components/admin/admin-users-page';
import { Authorized } from './providers/user-permission-provider';

export const AppRoutes: React.FunctionComponent = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh"
                }}>
                <CircularProgress size='5rem' />
                <Box sx={{
                    mt: 4
                }}>
                    <Typography variant="h5">Loading your road to success...</Typography>
                </Box>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/legal/*" element={<LegalRoutes />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <Box sx={{ ml: { sm: 7 } }}>
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
