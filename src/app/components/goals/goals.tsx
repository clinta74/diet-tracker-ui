import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography, useTheme } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Api } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import { VictoryType } from '../../../api/endpoints/victory';
import { Divider } from '@material-ui/core';
import { useEffect } from 'react';

export const Goals: React.FC = () => {
    const commonClasses = useCommonStyles();
    const theme = useTheme();
    const alert = useAlertMessage();
    const confirm = useConfirm();

    const [goals, setGoals] = useState<Victory[]>([]);
    const [open, setOpen] = React.useState(false);
    const [newGoal, setNewGoal] = useState<Victory>({
        userId: '',
        victoryId: 0,
        name: '',
        when: null,
        type: VictoryType.Goal,
    });

    useEffect(() => {
        Api.Victory.getVictories(VictoryType.Goal)
            .then(({ data }) => {
                setGoals(data);
            });
    }, []);

    const onClickAddGoal = () => {
        setNewGoal({
            userId: '',
            victoryId: 0,
            name: '',
            when: null,
            type: VictoryType.Goal,
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const onChangeNewGoalName: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        setNewGoal(goal => ({
            ...goal,
            name: value,
        }));
    }

    const handleAddFueling = () => {
        if (newGoal.victoryId === 0) {
            Api.Victory.addVictory(newGoal)
                .then(({ data }) => {
                    setGoals(goals => {
                        return [
                            ...goals,
                            data,
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
        else {
            Api.Victory.updateVictory(newGoal.victoryId, newGoal)
                .then(() => {
                    setGoals(goals => {
                        return [
                            ...goals.filter(goal => goal.victoryId !== newGoal.victoryId),
                            { ...newGoal },
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
    }

    const onClickEditGoal = (victoryId: number) => {
        const data = goals.find(goal => goal.victoryId === victoryId);
        if (data) {
            setNewGoal({ ...data })
            setOpen(true);
        }
    }

    const handleDeleteFueling = (victoryId: number) => {
        const goal = goals.find(f => f.victoryId === victoryId);
        confirm({ description: `Are you sure you want to delete ${goal?.name}?` })
            .then(() => {
                Api.Fueling.deleteFueling(victoryId)
                    .then(() => {
                        const idx = goals.findIndex(f => f.victoryId === victoryId);
                        setGoals(goals => {
                            return [...goals.slice(0, idx), ...goals.slice(idx + 1)];
                        });
                    })
                    .catch(error => alert.addMessage(error))
                    .finally(() => setOpen(false));
            })
            .catch(() => null);
    }

    const sortedGoals = goals.sort((a, b) => a.name > b.name ? 1 : -1)

    return (
        <React.Fragment>
            <Box position="relative">
                <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                    <Fab color="primary" title="Create a Fueling" aria-label="add" onClick={onClickAddGoal}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Goals</Typography>
                        <p>Setting goals is a great way to make sure that you feel like you are making progress.</p>
                    </Box>
                    <List>
                        {
                            sortedGoals &&
                            sortedGoals.map(goal =>
                                <React.Fragment key={goal.victoryId}>
                                    <ListItem>
                                        <Box flexGrow={1} display="flex" alignItems="center">
                                            <Box flexGrow={1}><ListItemText primary={goal.name} /></Box>
                                            <Box>
                                                <IconButton size="small" onClick={() => onClickEditGoal(goal.victoryId)}>
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                                <IconButton size="small" color="secondary" onClick={() => handleDeleteFueling(goal.victoryId)}>
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
                        Please enter your goal here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="goal"
                        label="Goal"
                        type="text"
                        fullWidth
                        value={newGoal.name}
                        onChange={onChangeNewGoalName}
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