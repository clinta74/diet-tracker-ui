import React from 'react';
import { AppState, useAuth0 } from '@auth0/auth0-react';
import { 
    AppBar, 
    Avatar, 
    Box, 
    Button, 
    createStyles, 
    Hidden, 
    IconButton, 
    makeStyles, 
    Theme, 
    Toolbar, 
    Typography, 
    useScrollTrigger 
} from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';

// Local imports
import { Authenticated } from '../../../auth/authenticated';

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

const drawerWidth = 240;

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
                        <Hidden smDown>
                            <Box flexGrow={1}>
                                <Typography variant="h6">Food Journal</Typography>
                            </Box>
                        </Hidden>
                        <Box ml={2}>
                            <Authenticated>
                                <Box display="flex" alignItems="center">
                                    <Box mr={1}>Hello, {name}</Box>
                                    <Avatar src={picture}>{!!!picture && name[0] }</Avatar>
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