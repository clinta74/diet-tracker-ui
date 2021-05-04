import React, { createContext } from 'react';
import {
    Drawer,
    IconButton,
    makeStyles,
    Theme,
    createStyles,
    useTheme,
    List,
    Divider,
    ClickAwayListener,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TodayIcon from '@material-ui/icons/Today';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasketOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import { Authenticated } from '../../../auth/authenticated';
import { ListItem } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { Authorized } from '../../providers/user-permission-provider';

interface SideNavProps {
    open: boolean;
    handleDrawerClose: React.MouseEventHandler;
    handleClickAway: React.MouseEventHandler<Document>;
}

export const SideNavContext = createContext(false);

const drawerWidth = 240;

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

                        <NavLink to="/plan" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon title="Your Plan"><AssignmentOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="Your Plan" />
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