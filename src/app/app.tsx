import React from 'react';
import { Box, Container, createStyles, CssBaseline, makeStyles } from '@material-ui/core';
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0ProviderWithHistory } from '../auth/auth0-provider-with-history';
import { AppRoutes } from './app-routes';
import { AlertMessage, AlertProvider } from './providers/alert-provider';
import backgroundImage from '../img/wheat-background.jpeg';
import { Navigation } from './components/navigation/navigation';
import { UserPermissionProvider } from './providers/user-permission-provider';

const useStyles = makeStyles(() =>
    createStyles({
        background: {
            position: 'absolute',
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            opacity: 0.1,
            height: '100%',
            width: '100%',
            zIndex: 1,
        },
    })
);

export const App: React.FC = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <Box position="relative" minHeight="100vh" zIndex={1}>
                <Box className={classes.background} />
                <Box position="relative" zIndex={2}>
                    <AlertProvider>
                        <AlertMessage />
                        <Router>
                            <Auth0ProviderWithHistory>
                                <UserPermissionProvider>
                                    <Navigation />
                                    <Container maxWidth="md">
                                        <AppRoutes />
                                    </Container>
                                </UserPermissionProvider>
                            </Auth0ProviderWithHistory>
                        </Router>
                    </AlertProvider>
                </Box>
            </Box>
        </React.Fragment >
    );
}