import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { format, formatDistanceToNow, formatISO, parseISO } from 'date-fns';
import { useApi } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import { VictoryType } from '../../../api/endpoints/victory';
import { Divider } from '@material-ui/core';

export const Goals: React.FC = () => {
    const commonClasses = useCommonStyles();
    const theme = useTheme();
    const alert = useAlertMessage();
    const confirm = useConfirm();
    const { Api } = useApi();

    const [victory, setVictory] = useState<Victory[]>([]);
    const [open, setOpen] = React.useState(false);
    const [newVictory, setNewVictory] = useState<Victory>({
        userId: '',
        victoryId: 0,
        name: '',
        when: null,
        type: VictoryType.Goal,
    });

    useEffect(() => {
        Api.Victory.getVictories(VictoryType.Goal)
            .then(({ data }) => {
                setVictory(data);
            });
    }, []);

    const onClickAddGoal = () => {
        setNewVictory({
            userId: '',
            victoryId: 0,
            name: '',
            when: null,
            type: VictoryType.Goal,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChangeNewVictoryName: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        setNewVictory(goal => ({
            ...goal,
            name: value,
        }));
    };

    const onChangeNewVictoryWhen: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;

        setNewVictory(goal => ({
            ...goal,
            when: value,
        }));
    };

    const onClickAddVictory = () => {
        const victory = {
            ...newVictory,
            when: newVictory.when && formatISO(parseISO(newVictory.when)) || null,
        };
        if (newVictory.victoryId === 0) {
            Api.Victory.addVictory(victory)
                .then(({ data }) => {
                    setVictory(goals => {
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
            Api.Victory.updateVictory(newVictory.victoryId, victory)
                .then(() => {
                    setVictory(goals => {
                        return [
                            ...goals.filter(goal => goal.victoryId !== newVictory.victoryId),
                            { ...victory },
                        ]
                    });
                })
                .catch(error => alert.addMessage(error))
                .finally(() => setOpen(false));
        }
    };

    const onClickEditVictory = (victoryId: number) => {
        const data = victory.find(goal => goal.victoryId === victoryId);
        if (data) {
            setNewVictory({ 
                ...data,
                when: data.when && format(parseISO(data.when), 'yyyy-MM-dd')
             })
            setOpen(true);
        }
    };

    const onClickDeleteVictory = (victoryId: number) => {
        const goal = victory.find(f => f.victoryId === victoryId);
        confirm({ description: `Are you sure you want to delete ${goal?.name}?` })
            .then(() => {
                Api.Victory.deleteVictory(victoryId)
                    .then(() => {
                        const idx = victory.findIndex(f => f.victoryId === victoryId);
                        setVictory(goals => {
                            return [...goals.slice(0, idx), ...goals.slice(idx + 1)];
                        });
                    })
                    .catch(error => alert.addMessage(error))
                    .finally(() => setOpen(false));
            })
            .catch(() => null);
    };

    const sortedVictories = victory.sort((a, b) => a.name > b.name ? 1 : -1);

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
                            sortedVictories.map(goal =>
                                <React.Fragment key={goal.victoryId}>
                                    <ListItem>
                                        <Box flexGrow={1} display="flex" alignItems="center">
                                            <Box flexGrow={1}><ListItemText primary={goal.name} /></Box>
                                            <Box mx={2}>
                                                {goal.when && formatDistanceToNow(parseISO(goal.when), {addSuffix: true})}
                                            </Box>
                                            <Box whiteSpace="nowrap">
                                                <IconButton size="small" onClick={() => onClickEditVictory(goal.victoryId)}>
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                                <IconButton size="small" color="secondary" onClick={() => onClickDeleteVictory(goal.victoryId)}>
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

            <Dialog open={open} onClose={handleClose} disableBackdropClick aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
                <DialogTitle id="form-dialog-title">Goals</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your goal here.
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth>
                                <TextField
                                    autoComplete="false"
                                    autoFocus
                                    id="goal"
                                    type="text"
                                    value={newVictory.name}
                                    onChange={onChangeNewVictoryName}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <TextField name="when" type="date" value={newVictory.when || ''} onChange={onChangeNewVictoryWhen}/>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onClickAddVictory} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}