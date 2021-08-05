import React from 'react';
import { Box, Container, createStyles, CssBaseline, makeStyles } from '@material-ui/core';
import { createTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from "react-router-dom";
import { ConfirmProvider } from 'material-ui-confirm';
import { Auth0ProviderWithHistory } from '../auth/auth0-provider-with-history';
import { AppRoutes } from './app-routes';
import { AlertMessage, AlertProvider } from './providers/alert-provider';
import backgroundImage from '../img/wheat-background.jpeg';
import { Navigation } from './components/navigation/navigation';
import { UserPermissionProvider } from './providers/user-permission-provider';

const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#4F662B',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#A13152',
      },
    },
  });


const useStyles = makeStyles((theme: Theme) =>
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
        container: {
            paddingBottom: theme.spacing(2),
        },
    })
);

export const App: React.FC = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <ThemeProvider theme={theme}>
            <ConfirmProvider>
                <Box position="relative" minHeight="100vh" zIndex={1}>
                    <Box className={classes.background} />
                    <Box position="relative" zIndex={2}>
                        <AlertProvider>
                            <AlertMessage />
                            <Router>
                                <Auth0ProviderWithHistory>
                                    <UserPermissionProvider>
                                        <Navigation />
                                        <Container className={classes.container} maxWidth="lg">
                                            <AppRoutes />
                                        </Container>
                                    </UserPermissionProvider>
                                </Auth0ProviderWithHistory>
                            </Router>
                        </AlertProvider>
                    </Box>
                </Box>
            </ConfirmProvider>
            </ThemeProvider>
        </React.Fragment >
    );
}
