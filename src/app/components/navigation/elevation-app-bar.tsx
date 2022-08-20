import React from 'react';
import { AppState, useAuth0 } from '@auth0/auth0-react';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Hidden,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';
import clsx from 'clsx';
import MenuIcon from '@mui/icons-material/Menu';

// Local imports
import { Authenticated } from '../../../auth/authenticated';
import { createStyles, makeStyles } from '@mui/styles';
import { drawerWidth } from './navigation';

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
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        toolbar: {
            marginBottom: theme.spacing(2),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
    })
);

interface ElevateAppBarProps {
    open: boolean;
    handleDrawerOpen: React.MouseEventHandler;
}

export const ElevateAppBar: React.FC<ElevateAppBarProps> = ({ open, handleDrawerOpen }) => {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();
    const classes = useStyles();

    const login = () => {
        const appState: AppState = {
            returnTo: window.location.pathname,
        }
        loginWithRedirect({ appState });
    }

    const { name, picture } = user ?? { name: '' };
    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                    <Toolbar>
                        {
                            isAuthenticated &&
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: open,
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
                        <Box flexGrow={1}>
                            <Hidden smDown>
                                <Typography variant="h6">Your Meal Tracker</Typography>
                            </Hidden>
                        </Box>
                        <Box ml={2}>
                            <Authenticated>
                                <Box display="flex" alignItems="center">
                                    <Box mr={1}>Hello, {name}</Box>
                                    <Avatar src={picture}>{!!!picture && (!!name ? name[0] : '')}</Avatar>
                                </Box>
                            </Authenticated>
                            <Authenticated invert>
                                <Button onClick={login} color="inherit">Sign In</Button>
                            </Authenticated>
                        </Box>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar className={classes.toolbar} />
        </React.Fragment>
    );
}