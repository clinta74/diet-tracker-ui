import { LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { AppBar, Box, Button, createStyles, makeStyles, Theme, Toolbar, Typography, useScrollTrigger } from '@material-ui/core';
import React from 'react';

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
    const { isAuthenticated, isLoading, logout } = useAuth0();
    const classes = useStyles();

    const logoutOptions: LogoutOptions = {
        returnTo: window.location.origin,
    }

    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar>
                    <Toolbar>
                        <Box flexGrow={1}>
                            <Typography variant="h6">Diet Tracker</Typography>
                        </Box>
                        {
                            isAuthenticated && !isLoading &&
                            <Box ml={2}>
                                <Button onClick={() => logout(logoutOptions)} color="inherit">Logout</Button>
                            </Box>
                        }
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar className={classes.toolbar}/>
        </React.Fragment>
    );
}