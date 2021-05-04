import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Api } from '../../../api';
import { useCommonStyles } from '../common-styles';
import { useAlertMessage } from '../../providers/alert-provider';
import { useConfirm } from 'material-ui-confirm';

export const Fuelings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const theme = useTheme();
    const alert = useAlertMessage();
    const confirm = useConfirm();

    const [open, setOpen] = React.useState(false);
    const [fuelings, setFuelings] = useState<Fueling[]>([]);
    const [newFueling, setNewFueling] = useState<Fueling>({
        fuelingId: 0,
        name: '',
    });

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => {
                setFuelings(data);
            });
    }, []);

    const onClickAddFueling = () => {
        setNewFueling({
            fuelingId: 0,
            name: '',
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
                        return [
                            ...fuelings,
                            data,
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
        else {
            Api.Fueling.updateFueling(newFueling.fuelingId, newFueling)
                .then(() => {
                    setFuelings(fuelings => {
                        return [
                            ...fuelings.filter(fueling => fueling.fuelingId !== newFueling.fuelingId),
                            { ...newFueling },
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
    }

    const onClickEditFueling = (fuelingId: number) => {
        const data = fuelings.find(fueling => fueling.fuelingId === fuelingId);
        if (data) {
            setNewFueling({ ...data })
            setOpen(true);
        }
    }

    const handleDeleteFueling = (fuelingId: number) => {
        const fueling = fuelings.find(f => f.fuelingId === fuelingId);
        confirm({ description: `Are you sure you want to delete ${fueling?.name}?`})
            .then(() => {
                Api.Fueling.deleteFueling(fuelingId)
                    .then(() => {
                        const idx = fuelings.findIndex(f => f.fuelingId === fuelingId);
                        setFuelings(fuelings => {
                            return [...fuelings.slice(0, idx), ...fuelings.slice(idx + 1)];
                        });
                    })
                    .catch(error => alert.addMessage(error))
                    .finally(() => setOpen(false));
            })
            .catch(() => null);
    }

    const onChangeNewFuelingName: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        setNewFueling(fueling => ({
            ...fueling,
            name: value,
        }));
    }

    const sortedFuelings = fuelings.sort((a, b) => a.name > b.name ? 1 : -1)

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
                            sortedFuelings &&
                            sortedFuelings.map(fueling =>
                                <React.Fragment key={fueling.fuelingId}>
                                    <ListItem>
                                        <Box flexGrow={1} display="flex" alignItems="center">
                                            <Box flexGrow={1}><ListItemText primary={fueling.name} /></Box>
                                            <Box>
                                                <IconButton size="small" onClick={() => onClickEditFueling(fueling.fuelingId)}>
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                                <IconButton size="small" color="secondary" onClick={() => handleDeleteFueling(fueling.fuelingId)}>
                                                    <RemoveCircleIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            )
                        }
                    </List>
                </Paper>
            </Box>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Fueling</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your the name of the fueling here.
                    </DialogContentText>
                    <TextField
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