import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    InputLabel,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import { useApi } from '../../../api';
import { FormControl } from '@material-ui/core';
import { UserTrackingType } from '../../../api/endpoints/user-tracking';
import { useConfirm } from 'material-ui-confirm';
import { List } from '@material-ui/core';

const defaultTracking: UserTracking = {
    userId: '',
    title: '',
    disabled: false,
    description: '',
    occurrences: 0,
    userTrackingId: 0,
    order: 0,
    values: [],
}

export const Trackings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const theme = useTheme();
    const { Api } = useApi();
    const confirm = useConfirm();

    const [trackings, setTrackings] = useState<UserTracking[]>();
    const [open, setOpen] = React.useState(false);
    const [newTracking, setNewTracking] = useState<UserTracking>(defaultTracking);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        Api.UserTracking.getActiveUserTrackings()
            .then(({ data }) => setTrackings(data))
            .catch(error => alert.addMessage(error));
    }, []);

    const onClickAddTracking = () => {
        setNewTracking({
            ...defaultTracking
        });
        setOpen(true);
    };

    const onClickEditTracking = () => {
        handleCloseMenu();
        if (trackings && anchorEl) {
            const userTrackingId = Number(anchorEl.dataset.id);
            const data = trackings.find(tracking => tracking.userTrackingId === userTrackingId);
            if (data) {
                setNewTracking({
                    ...data
                })
                setOpen(true);
            }
            handleCloseMenu();
        }
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
                        .catch(error => alert.addMessage(error))
                        .finally(() => setOpen(false));
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

    const onClickCancelTracking = () => {
        setOpen(false);
    };

    const onChangeNewTrackingTextValue: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value, name } = event.target;

        setNewTracking(tracking => ({
            ...tracking,
            [name]: value,
        }));
    };

    const onChangeNewTrackingNumericValue: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value, name } = event.target;

        const num = Math.max(0, Number(value));

        setNewTracking(tracking => ({
            ...tracking,
            [name]: Number(num),
        }));
    };

    const onChangeTrackingType = (event: React.ChangeEvent<{ value: unknown }>) => {
        const type = event.target.value as UserTrackingType;

        setNewTracking(tracking => ({
            ...tracking,
            type,
        }));
    };

    const onClickSaveTracking = () => {
        if (newTracking.userTrackingId === 0) {
            Api.UserTracking.addUserTracking(newTracking)
                .then(({ data }) => {
                    setTrackings(trackings => {
                        return trackings ? [
                            ...trackings,
                            data,
                        ] : [data]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
        else {
            Api.UserTracking.updateUserTracking(newTracking.userTrackingId, newTracking)
                .then(() => {
                    setTrackings(trackings => {
                        return trackings && [
                            ...trackings.filter(tracking => tracking.userTrackingId !== newTracking.userTrackingId),
                            { ...newTracking },
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
    }

    return (
        <React.Fragment>
            <Box position="relative">
                <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                    <Fab color="primary" title="Create a Plan" aria-label="add" onClick={onClickAddTracking}>
                        <AddIcon />
                    </Fab>
                </Box>
                <TableContainer component={Paper} className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Extra Trackings</Typography>
                        <p>You can add tracking for either numbers or events everyday.</p>
                    </Box>
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
                                trackings.map(({ userTrackingId, title, description, occurrences, order, disabled, values }) =>
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
                                                            <span title={description}>{name} as {type === UserTrackingType.Number ? 'Number' : 'Yes / No'}</span>
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
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

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

            <Dialog open={open} onClose={handleCloseMenu} disableBackdropClick aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
                <DialogTitle id="form-dialog-title">Tracking</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the information about the value you would like to track.
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Name"
                                    autoComplete="false"
                                    autoFocus
                                    id="new-tracking-name"
                                    type="text"
                                    name="name"
                                    value={newTracking.title}
                                    onChange={onChangeNewTrackingTextValue}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Description"
                                    autoComplete="false"
                                    id="new-tracking-description"
                                    type="text"
                                    name="description"
                                    value={newTracking.description}
                                    onChange={onChangeNewTrackingTextValue}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Times per Day"
                                    autoComplete="false"
                                    id="new-tracking-occurrences"
                                    type="number"
                                    name="occurrences"
                                    value={newTracking.occurrences ? newTracking.occurrences : ''}
                                    onChange={onChangeNewTrackingNumericValue}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            {/* <FormControl fullWidth>
                                <InputLabel id="tracking-select-type-label">Type</InputLabel>
                                <Select
                                    labelId="tracking-select-type-label"
                                    id="tracking-select-type"
                                    value={newTracking.type}
                                    onChange={onChangeTrackingType}
                                >
                                    <MenuItem value="Number">Number</MenuItem>
                                    <MenuItem value="Boolean">Yes / No </MenuItem>
                                </Select>
                            </FormControl> */}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickCancelTracking} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onClickSaveTracking} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}