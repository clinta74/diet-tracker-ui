import { AppState, LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { AppBar, Box, Button, createStyles, makeStyles, Theme, Toolbar, Typography, useScrollTrigger } from '@material-ui/core';
import React from 'react';
import { Authenticated } from '../../auth/authenticated';

const ElevationScroll: React.FC = ({ children }) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window,
    });

    return React.cloneElement(children as React.ReactElement, {
        elevation: trigger ? 4 : 0,
    });
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            marginBottom: theme.spacing(2),
        }
    })
);

export const ElevateAppBar: React.FC = () => {
    const { logout, loginWithRedirect } = useAuth0();
    const classes = useStyles();

    const logoutOptions: LogoutOptions = {
        returnTo: window.location.origin,
    }

    const login = () => {
        const appState: AppState = {
            returnTo: window.location.pathname,
        }
        loginWithRedirect({ appState });
    }

    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar>
                    <Toolbar>
                        <Box flexGrow={1}>
                            <Typography variant="h6">Diet Tracker</Typography>
                        </Box>
                        <Box ml={2}>
                            <Authenticated>
                                <Button onClick={() => logout(logoutOptions)} color="inherit">Logout</Button>
                            </Authenticated>
                            <Authenticated invert>
                                <Button onClick={login} color="inherit">Login</Button>
                            </Authenticated>
                        </Box>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar className={classes.toolbar} />
        </React.Fragment>
    );
}