import React, { createContext } from 'react';
import {
    Box,
    Drawer,
    IconButton,
    Theme,
    useTheme,
    List,
    Divider,
    ClickAwayListener,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasketOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

import { Authenticated } from '../../../auth/authenticated';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import { Authorized } from '../../providers/user-permission-provider';
import { drawerWidth } from './navigation';

interface SideNavProps {
    open: boolean;
    handleDrawerClose: React.MouseEventHandler;
    handleClickAway: (event: MouseEvent | TouchEvent) => void;
}

export const SideNavContext = createContext(false);

const drawerWidthSx = (theme: Theme, open: boolean) => open
    ? {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }
    : {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: { xs: 0, sm: theme.spacing(7) },
    };

const NavItemLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    '&.active > *': {
        backgroundColor: theme.palette.action.selected,
    },
}));

export const SideNav: React.FC<SideNavProps> = ({ open, handleDrawerClose, handleClickAway }) => {
    const theme = useTheme();
    const { logout } = useAuth();

    return (
        <Authenticated>
            <ClickAwayListener onClickAway={handleClickAway}>
                <Drawer
                    variant="permanent"
                    sx={theme => ({
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        ...drawerWidthSx(theme, open),
                        '& .MuiDrawer-paper': drawerWidthSx(theme, open),
                    })}
                >
                    <Box sx={theme => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: theme.spacing(0, 1),
                        // necessary for content to be below app bar
                        ...theme.mixins.toolbar,
                    })}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </Box>
                    <Divider />
                    <List>
                        <NavItemLink to="/day">
                            <ListItemButton>
                                <ListItemIcon title="Today"><TodayIcon /></ListItemIcon>
                                <ListItemText primary="Today" />
                            </ListItemButton>
                        </NavItemLink>

                        <NavItemLink to="/goals">
                            <ListItemButton>
                                <ListItemIcon title="Your Goals"><FlagOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Your Goals" />
                            </ListItemButton>
                        </NavItemLink>

                        <NavItemLink to="/settings">
                            <ListItemButton>
                                <ListItemIcon title="Settings"><AssignmentOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItemButton>
                        </NavItemLink>
                        
                        <NavItemLink to="/trackings">
                            <ListItemButton>
                                <ListItemIcon title="Tracking"><ExploreOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Tracking" />
                            </ListItemButton>
                        </NavItemLink>
                    </List>

                    <Authorized permissions={['write:fuelings', 'write:plans']}>
                        <Divider />
                        <List>
                            <Authorized permissions={['write:fuelings']}>
                                <NavItemLink to="/fuelings">
                                    <ListItemButton>
                                        <ListItemIcon title="Fuelings"><ShoppingBasketIcon /></ListItemIcon>
                                        <ListItemText primary="Fuelings" />
                                    </ListItemButton>
                                </NavItemLink>
                            </Authorized>

                            <Authorized permissions={['write:plans']}>
                                <NavItemLink to="/plans">
                                    <ListItemButton>
                                        <ListItemIcon title="Plans"><SettingsIcon /></ListItemIcon>
                                        <ListItemText primary="Plans" />
                                    </ListItemButton>
                                </NavItemLink>
                            </Authorized>
                        </List>
                    </Authorized>
                    
                    <Authorized permissions={['admin:users']}>
                        <Divider />
                        <List>
                            <NavItemLink to="/admin/users">
                                <ListItemButton>
                                    <ListItemIcon title="Admin"><SettingsIcon /></ListItemIcon>
                                    <ListItemText primary="Admin" />
                                </ListItemButton>
                            </NavItemLink>
                        </List>
                    </Authorized>

                    <Divider />

                    <List>
                        <NavItemLink to="/settings/account">
                            <ListItemButton>
                                <ListItemIcon title="Account"><AssignmentOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Account" />
                            </ListItemButton>
                        </NavItemLink>
                        <ListItemButton onClick={() => logout()}>
                            <ListItemIcon title="Sign Out"><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary="Sign Out" />
                        </ListItemButton>
                    </List>
                </Drawer>
            </ClickAwayListener>
        </Authenticated>
    );
}