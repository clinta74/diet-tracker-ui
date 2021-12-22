import React, { useEffect, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Divider,
    Fab,
    Hidden,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
    LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAlertMessage } from '../../../providers/alert-provider';
import { useCommonStyles } from '../../common-styles';
import { useApi } from '../../../../api';
import { UserTrackingType } from '../../../../api/endpoints/user-tracking';

export const Trackings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const theme = useTheme();
    const { Api } = useApi();
    const confirm = useConfirm();
    const navigate = useNavigate();

    const [trackings, setTrackings] = useState<UserTracking[]>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        Api.UserTracking.getUserTrackings()
            .then(({ data }) => setTrackings(data))
            .catch(error => alert.addMessage(error));
    }, []);

    const onClickEditTracking = () => {
        handleCloseMenu();
        if (anchorEl) {
            const id = anchorEl.dataset.id;
            if (id) {
                navigate(`/tracking/${id}`);
            }
            setAnchorEl(null);
        }
    };

    const onClickAddTracking = () => {
        navigate(`/tracking/add`);
    };

    const onClickDeleteTracking = () => {
        handleCloseMenu();
        if (trackings && anchorEl) {
            const userTrackingId = Number(anchorEl.dataset.id);
            const tracking = trackings.find(f => f.userTrackingId === userTrackingId);
            confirm({ description: `Are you sure you want to delete ${tracking?.title}?` })
                .then(() => {
                    Api.UserTracking.deleteUserTracking(userTrackingId)
                        .then(() => {
                            const idx = trackings.findIndex(f => f.userTrackingId === userTrackingId);
                            setTrackings(trackings => {
                                return trackings && [...trackings.slice(0, idx), ...trackings.slice(idx + 1)];
                            });
                        })
                        .catch(error => alert.addMessage(error));
                })
                .catch(() => null)
                .finally(handleCloseMenu);
        }
    };

    const onClickMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const typeNames = {
        [UserTrackingType.Number]: "Number",
        [UserTrackingType.WholeNumber]: "Whole Number",
        [UserTrackingType.Boolean]: "Yes / No",
        [UserTrackingType.Icon]: "Icon",
    }

    return (
        <React.Fragment>
            <Box position="relative">
                <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                    <Fab color="primary" title="Create a Plan" aria-label="add" onClick={onClickAddTracking}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Extra Trackings</Typography>
                        <p>You can add tracking for either numbers or events everyday.</p>
                    </Box>
                    <Hidden smDown>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell width={1}>Occurances</TableCell>
                                        <TableCell width={1}>Disabled</TableCell>
                                        <TableCell>Value(s)</TableCell>
                                        <TableCell width={1} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        trackings &&
                                        trackings.length === 0 &&
                                        <TableRow><TableCell colSpan={6}>No tracking options found.</TableCell></TableRow>
                                        ||
                                        trackings &&
                                        trackings.map(({ userTrackingId, title, description, occurrences, disabled, values }) =>
                                            <TableRow key={userTrackingId}>
                                                <TableCell>{title}</TableCell>
                                                <TableCell>{description}</TableCell>
                                                <TableCell align="right">{occurrences}</TableCell>
                                                <TableCell>{disabled ? 'Yes' : 'No'}</TableCell>
                                                <TableCell>
                                                    {
                                                        values &&
                                                        values.map(({ name, description, type, userTrackingValueId }) =>
                                                            <Box key={userTrackingValueId}>
                                                                <span title={description}>{name} as {typeNames[type]}</span>
                                                            </Box>
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell width={1}>
                                                    <IconButton aria-haspopup="true" onClick={onClickMenuOpen} data-id={userTrackingId}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                        ||
                                        <TableRow><TableCell colSpan={6}><LinearProgress /></TableCell></TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Hidden>

                    <Hidden mdUp>
                        <List>
                            {
                                trackings &&
                                trackings.map(({ userTrackingId, title, description, occurrences, disabled, values }, idx) =>
                                    <React.Fragment key={userTrackingId}>
                                    <ListItem>
                                        <Box width="100%">
                                            <Box fontSize="1.25em" fontWeight="bold">{title}</Box>
                                            <Box display="flex">
                                                <Box flexGrow={1}>
                                                    <Box>{description}</Box>
                                                    <Box><strong>Occurrences:</strong> {occurrences}</Box>
                                                    <Box><strong>Disabled:</strong> {disabled ? 'Yes' : 'No'}</Box>
                                                    <Box>
                                                        {
                                                            values &&
                                                            values.map(({ name, description, type, userTrackingValueId }) =>
                                                                <Box key={userTrackingValueId}>
                                                                    <span title={description}>{name} as {typeNames[type]}</span>
                                                                </Box>
                                                            )
                                                        }
                                                    </Box>
                                                </Box>
                                                <Box flexShrink={1}>
                                                    <IconButton aria-haspopup="true" onClick={onClickMenuOpen} data-id={userTrackingId}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    {
                                        idx < trackings.length -1 && <Divider />
                                    }
                                    </React.Fragment>
                                )
                                
                            }
                        </List>
                    </Hidden>
                </Paper>


                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={openMenu}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={onClickEditTracking}>Edit</MenuItem>
                    <MenuItem onClick={onClickDeleteTracking}>Delete</MenuItem>
                </Menu>
            </Box>

        </React.Fragment>
    );
}