import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Pagination,
    PaginationItem,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useApi } from '../../../api';
import { useCommonStyles } from '../common-styles';
import { useAlertMessage } from '../../providers/alert-provider';
import { useConfirm } from 'material-ui-confirm';
import { Link, useLocation } from 'react-router-dom';

const defaultFueling: Fueling = {
    fuelingId: 0,
    name: '',
};

export const Fuelings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const theme = useTheme();
    const alert = useAlertMessage();
    const confirm = useConfirm();
    const location = useLocation();
    const { Api } = useApi();

    const [open, setOpen] = React.useState(false);
    const [fuelings, setFuelings] = useState<Fueling[]>([]);
    const [newFueling, setNewFueling] = useState<Fueling>(defaultFueling);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const itemsPerPage = 10;

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => {
                setFuelings(data);
            });
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const totalPages = Math.ceil(fuelings.length / itemsPerPage);
        const page = parseInt(query.get('page') || '1', 10);
        setPage(page);
        setTotalPages(totalPages);
    }, [location.search, fuelings]);

    const onClickAddFueling = () => {
        setNewFueling({
            ...defaultFueling
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddFueling = () => {
        if (newFueling.fuelingId === 0) {
            Api.Fueling.addFueling(newFueling)
                .then(({ data }) => {
                    setFuelings(fuelings => {
                        return fuelings ? [
                            ...fuelings,
                            data,
                        ] : [data]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
        else {
            Api.Fueling.updateFueling(newFueling.fuelingId, newFueling)
                .then(() => {
                    setFuelings(fuelings => {
                        return fuelings && [
                            ...fuelings.filter(fueling => fueling.fuelingId !== newFueling.fuelingId),
                            { ...newFueling },
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
    }

    const onClickEditFueling = () => {
        handleCloseMenu();
        if (fuelings && anchorEl) {
            const fuelingId = Number(anchorEl.dataset.id);
            const data = fuelings.find(fueling => fueling.fuelingId === fuelingId);
            if (data) {
                setNewFueling({ ...data })
                setOpen(true);
            }
        }
    }

    const handleDeleteFueling = () => {
        handleCloseMenu();
        if (fuelings && anchorEl) {
            const fuelingId = Number(anchorEl.dataset.id);
            const fueling = fuelings.find(f => f.fuelingId === fuelingId);
            confirm({ description: `Are you sure you want to delete ${fueling?.name}?` })
                .then(() => {
                    Api.Fueling.deleteFueling(fuelingId)
                        .then(() => {
                            const idx = fuelings.findIndex(f => f.fuelingId === fuelingId);
                            setFuelings(fuelings => {
                                return fuelings && [...fuelings.slice(0, idx), ...fuelings.slice(idx + 1)];
                            });
                        })
                        .catch(error => alert.addMessage(error))
                        .finally(() => setOpen(false));
                })
                .catch(() => null);
        }
    }

    const onChangeNewFuelingName: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        setNewFueling(fueling => ({
            ...fueling,
            name: value,
        }));
    }

    const onClickMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const sortedFuelings = fuelings
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .slice(itemsPerPage * (page - 1), itemsPerPage * (page - 1) + itemsPerPage);

    return (
        <React.Fragment>
            <Box position="relative">
                <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                    <Fab color="primary" title="Create a Fueling" aria-label="add" onClick={onClickAddFueling}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Fuelings</Typography>
                    </Box>
                    <List>
                        {
                            sortedFuelings.map(fueling =>
                                <React.Fragment key={fueling.fuelingId}>
                                    <ListItem>
                                        <Box flexGrow={1} display="flex" alignItems="center">
                                            <Box flexGrow={1}><ListItemText primary={fueling.name} /></Box>
                                            <Box whiteSpace="nowrap">
                                                <IconButton aria-haspopup="true" onClick={onClickMenuOpen} data-id={fueling.fuelingId}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            )
                        }
                    </List>

                    {
                        fuelings && totalPages > 1 &&

                        <Pagination
                            page={page}
                            count={totalPages}
                            renderItem={(item) => (
                                <PaginationItem
                                    component={Link}
                                    to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                                    {...item}
                                />
                            )}
                        />
                    }
                </Paper>
            </Box>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={openMenu}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={onClickEditFueling}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteFueling}>Delete</MenuItem>
            </Menu>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Fueling</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your the name of the fueling here.
                    </DialogContentText>
                    <TextField
                        variant="standard"
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newFueling.name}
                        onChange={onChangeNewFuelingName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddFueling} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}