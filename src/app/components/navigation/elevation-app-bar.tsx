import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Local imports
import { Authenticated } from '../../../auth/authenticated';
import { drawerWidth } from './navigation';

const ElevationScroll: React.FC<React.PropsWithChildren> = ({ children }) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window,
    });

    return React.cloneElement(children as React.ReactElement<{ elevation?: number }>, {
        elevation: trigger ? 4 : 0,
    });
}

interface ElevateAppBarProps {
    open: boolean;
    handleDrawerOpen: React.MouseEventHandler;
}

export const ElevateAppBar: React.FC<ElevateAppBarProps> = ({ open, handleDrawerOpen }) => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const { name } = user ?? { name: '' };
    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar sx={theme => ({
                    zIndex: theme.zIndex.drawer + 1,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
                    }),
                    ...(open && {
                        marginLeft: `${drawerWidth}px`,
                        width: `calc(100% - ${drawerWidth}px)`,
                    }),
                })}>
                    <Toolbar>
                        {
                            isAuthenticated &&
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
                        <Box sx={{
                            flexGrow: 1
                        }}>
                            <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>Your Meal Tracker</Typography>
                        </Box>
                        <Box sx={{
                            ml: 2
                        }}>
                            <Authenticated>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                    <Box sx={{
                                        mr: 1
                                    }}>Hello, {name}</Box>
                                    <Avatar>{!!name ? name[0] : ''}</Avatar>
                                </Box>
                            </Authenticated>
                            <Authenticated invert>
                                <Button onClick={() => navigate('/login')} color="inherit">Sign In</Button>
                            </Authenticated>
                        </Box>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar sx={{ mb: 2 }} />
        </React.Fragment>
    );
}