import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from "react-router-dom";
import { ConfirmProvider } from 'material-ui-confirm';
import { AuthProvider } from '../auth/auth-context';
import { AppRoutes } from './app-routes';
import { AlertMessage, AlertProvider } from './providers/alert-provider';
import backgroundImage from '../img/wheat-background.jpeg';
import { Navigation } from './components/navigation/navigation';
import { UserPermissionProvider } from './providers/user-permission-provider';

export const App: React.FC = () => {

    return (
        <React.Fragment>
            <CssBaseline />
            <ConfirmProvider>
                <Box
                    sx={{
                        position: "relative",
                        minHeight: "100vh",
                        zIndex: 1
                    }}>
                    <Box sx={{
                        position: 'absolute',
                        backgroundImage: `url('${backgroundImage}')`,
                        backgroundSize: 'cover',
                        opacity: 0.1,
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                    }} />
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2
                        }}>
                        <AlertProvider>
                            <AlertMessage />
                            <Router>
                                <AuthProvider>
                                    <UserPermissionProvider>
                                        <Navigation />
                                        <Container sx={{ pb: 2 }} maxWidth="lg">
                                            <AppRoutes />
                                        </Container>
                                    </UserPermissionProvider>
                                </AuthProvider>
                            </Router>
                        </AlertProvider>
                    </Box>
                </Box>
            </ConfirmProvider>
        </React.Fragment >
    );
}
