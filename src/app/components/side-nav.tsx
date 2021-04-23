import React, { createContext } from 'react';
import { Drawer, IconButton, makeStyles, Theme, createStyles, useTheme, List, Divider, ClickAwayListener, ListItemIcon, ListItemText } from '@material-ui/core';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import SettingsIcon from '@material-ui/icons/Settings';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import { Authenticated } from '../../auth/authenticated';
import { ListItem } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

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
                        <NavLink to="/today" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon><CalendarViewDayIcon /></ListItemIcon>
                                <ListItemText primary="Todays" />
                            </ListItem>
                        </NavLink>
                        <ListItem button>
                            <ListItemIcon><ViewWeekIcon /></ListItemIcon>
                            <ListItemText primary="Your Plan" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <NavLink to="/fuelings" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                <ListItemText primary="Fuelings" />
                            </ListItem>
                        </NavLink>
                    </List>
                </Drawer>
            </ClickAwayListener>
        </Authenticated>
    );
}