import React, { createContext, useEffect, useState } from 'react';
import { Box, CircularProgress, Container, createStyles, CssBaseline, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { ElevateAppBar } from './components/elevation-app-bar';
import { Fuelings } from './components/fuelings';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Auth0ProviderWithHistory } from '../auth/auth0-provider-with-history';
import { useAuth0 } from '@auth0/auth0-react';
import { apiBase } from '../api/api-base';
import { Welcome } from './components/welcome';
import { SideNav } from './components/side-nav';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(7),
            }
        }
    })
);

export const App: React.FC = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Router>
                <Auth0ProviderWithHistory>
                    <ElevateAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
                    <SideNav open={open} handleDrawerClose={handleDrawerClose} />
                    <Box className={classes.root}>
                        <Container maxWidth="lg" >
                            <AppRoutes />
                        </Container>
                    </Box>
                </Auth0ProviderWithHistory>
            </Router>
        </React.Fragment >
    );
}

export const AppRoutes: React.FunctionComponent = () => {
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
            <Switch>
                <Route path="/" component={Fuelings} />
                <Redirect to="/" />
            </Switch>
        );
    }

    return <Welcome />
}