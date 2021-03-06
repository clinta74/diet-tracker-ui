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
    Menu,
    MenuItem,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format, formatDistanceToNow, formatISO, parseISO } from 'date-fns';
import { useApi } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import { VictoryType } from '../../../api/endpoints/victory';
import { Divider } from '@mui/material';

const defaultGoal: Victory = {
    userId: '',
    victoryId: 0,
    name: '',
    when: null,
    type: VictoryType.Goal,
};

export const Goals: React.FC = () => {
    const commonClasses = useCommonStyles();
    const theme = useTheme();
    const alert = useAlertMessage();
    const confirm = useConfirm();
    const { Api } = useApi();

    const [victories, setVictory] = useState<Victory[]>([]);
    const [open, setOpen] = React.useState(false);
    const [newVictory, setNewVictory] = useState<Victory>(defaultGoal);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        Api.Victory.getVictories()
            .then(({ data }) => {
                setVictory(data);
            });
    }, []);

    const onClickAddGoal = () => {
        setNewVictory({
            ...defaultGoal
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

    const onClickEditVictory = () => {
        handleCloseMenu();
        if (victories && anchorEl) {
            const victoryId = Number(anchorEl.dataset.id);
            const data = victories.find(goal => goal.victoryId === victoryId);
            if (data) {
                setNewVictory({
                    ...data,
                    when: data.when && format(parseISO(data.when), 'yyyy-MM-dd')
                })
                setOpen(true);
            }
        }
    };

    const onClickDeleteVictory = () => {
        handleCloseMenu();
        if (victories && anchorEl) {
            const victoryId = Number(anchorEl.dataset.id);
            const goal = victories.find(f => f.victoryId === victoryId);
            confirm({ description: `Are you sure you want to delete ${goal?.name}?` })
                .then(() => {
                    Api.Victory.deleteVictory(victoryId)
                        .then(() => {
                            const idx = victories.findIndex(f => f.victoryId === victoryId);
                            setVictory(goals => {
                                return [...goals.slice(0, idx), ...goals.slice(idx + 1)];
                            });
                        })
                        .catch(error => alert.addMessage(error))
                        .finally(() => setOpen(false));
                })
                .catch(() => null);
        }
    };

    const onClickMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const parseDate = (when: string | null) => when != null ? parseISO(when) : new Date(0);

    const sortedVictories = victories.sort((a, b) => parseDate(a.when) < parseDate(b.when) ? 1 : -1);

    const goals = sortedVictories.filter(victory => victory.type === VictoryType.Goal);
    const nonScale = sortedVictories.filter(victory => victory.type === VictoryType.NonScale);

    return (
        <React.Fragment>
            <Box position="relative" mb={4}>
                <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                    <Fab color="primary" title="Create a Goal" aria-label="add" onClick={onClickAddGoal}>
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
                            goals.length > 0 &&
                            goals.map(({ victoryId, name, when }) =>
                                <React.Fragment key={victoryId}>
                                    <ListItem>
                                        <Box flexGrow={1} display="flex" alignItems="center">
                                            <Box flexGrow={1}><ListItemText primary={name} /></Box>
                                            <Box mx={2}>
                                                {when && format(parseISO(when), 'M/d/yyyy')}
                                            </Box>
                                            <Box whiteSpace="nowrap">
                                                <IconButton aria-haspopup="true" onClick={onClickMenuOpen} data-id={victoryId}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            )
                            ||
                            <ListItem>
                                <ListItemText primary="You have not set any goals." />
                            </ListItem>

                        }
                    </List>
                </Paper>
            </Box>

            <Box position="relative">
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Non Scale Victories</Typography>
                        <p>See your victories along you road.</p>
                    </Box>
                    <List>
                        {
                            nonScale.length > 0 &&
                            nonScale.map(({ victoryId, name, when }) =>
                                <React.Fragment key={victoryId}>
                                    <ListItem>
                                        <Box flexGrow={1} display="flex" alignItems="center">
                                            <Box flexGrow={1}><ListItemText primary={name} /></Box>
                                            <Box mx={2}>
                                                {when && formatDistanceToNow(parseISO(when), { addSuffix: true })}
                                            </Box>
                                            <Box whiteSpace="nowrap">
                                                <IconButton aria-haspopup="true" onClick={onClickMenuOpen} data-id={victoryId}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            )
                            ||
                            <ListItem>
                                <ListItemText primary="You have not added any non-scale victories.  Go to a day and add them as you acheive them." />
                            </ListItem>
                        }
                    </List>
                </Paper>
            </Box>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={openMenu}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={onClickEditVictory}>Edit</MenuItem>
                <MenuItem onClick={onClickDeleteVictory}>Delete</MenuItem>
            </Menu>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
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
                                    variant="standard"
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
                                <TextField variant="standard" name="when" type="date" value={newVictory.when || ''} onChange={onChangeNewVictoryWhen} />
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