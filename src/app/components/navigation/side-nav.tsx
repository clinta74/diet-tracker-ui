import React, { createContext } from 'react';
import {
    Drawer,
    IconButton,
    Theme,
    useTheme,
    List,
    Divider,
    ClickAwayListener,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import clsx from 'clsx';

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
import { ListItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { Authorized } from '../../providers/user-permission-provider';
import { createStyles, makeStyles } from '@mui/styles';
import { drawerWidth } from './navigation';

interface SideNavProps {
    open: boolean;
    handleDrawerClose: React.MouseEventHandler;
    handleClickAway: (event: MouseEvent | TouchEvent) => void;
}

export const SideNavContext = createContext(false);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: 36,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: 0,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(7) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            '&.active > *': {
                backgroundColor: theme.palette.action.selected,
            }
        },
    }),
);

export const SideNav: React.FC<SideNavProps> = ({ open, handleDrawerClose, handleClickAway }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { logout } = useAuth0();

    const logoutOptions: LogoutOptions = {
        returnTo: window.location.origin,
    }

    return (
        <Authenticated>
            <ClickAwayListener onClickAway={handleClickAway}>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <NavLink to="/day" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon title="Today"><TodayIcon /></ListItemIcon>
                                <ListItemText primary="Today" />
                            </ListItem>
                        </NavLink>

                        <NavLink to="/goals" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon title="Your Goals"><FlagOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Your Goals" />
                            </ListItem>
                        </NavLink>

                        <NavLink to="/settings" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon title="Settings"><AssignmentOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        </NavLink>
                        
                        <NavLink to="/trackings" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon title="Tracking"><ExploreOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Tracking" />
                            </ListItem>
                        </NavLink>
                    </List>

                    <Authorized permissions={['write:fuelings', 'write:plans']}>
                        <Divider />
                        <List>
                            <Authorized permissions={['write:fuelings']}>
                                <NavLink to="/fuelings" className={classes.link}>
                                    <ListItem button>
                                        <ListItemIcon title="Fuelings"><ShoppingBasketIcon /></ListItemIcon>
                                        <ListItemText primary="Fuelings" />
                                    </ListItem>
                                </NavLink>
                            </Authorized>

                            <Authorized permissions={['write:plans']}>
                                <NavLink to="/plans" className={classes.link}>
                                    <ListItem button>
                                        <ListItemIcon title="Plans"><SettingsIcon /></ListItemIcon>
                                        <ListItemText primary="Plans" />
                                    </ListItem>
                                </NavLink>
                            </Authorized>
                        </List>
                    </Authorized>
                    
                    <Divider />

                    <List>
                        <ListItem button onClick={() => logout(logoutOptions)}>
                            <ListItemIcon title="Sign Out"><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary="Sign Out" />
                        </ListItem>
                    </List>
                </Drawer>
            </ClickAwayListener>
        </Authenticated>
    );
}