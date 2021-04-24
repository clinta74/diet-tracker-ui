import React from 'react';
import { Box, Container, createStyles, CssBaseline, makeStyles, Theme } from '@material-ui/core';
import { ElevateAppBar } from './components/elevation-app-bar';
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0ProviderWithHistory } from '../auth/auth0-provider-with-history';
import { SideNav } from './components/side-nav';
import { AppRoutes } from './app-routes';
import { AlertMessage, AlertProvider } from './components/alert-provider';
import backgroundImage from '../img/wheat-background.jpeg';

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
    })
);

export const App: React.FC = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen: React.MouseEventHandler = event => {
        event.stopPropagation();
        setOpen(true);
    };

    const handleDrawerClose: React.MouseEventHandler = () => {
        setOpen(false);
    };

    const handleClickAway: React.MouseEventHandler<Document> = () => {
        setOpen(false);
    }

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
                                <ElevateAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
                                <SideNav open={open} handleDrawerClose={handleDrawerClose} handleClickAway={handleClickAway} />
                                <Container maxWidth="lg">
                                    <AppRoutes />
                                </Container>
                            </Auth0ProviderWithHistory>
                        </Router>
                    </AlertProvider>
                </Box>
            </Box>
        </React.Fragment >
    );
}