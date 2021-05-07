import { Box, Fab, IconButton, LinearProgress, Menu, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { MenuItem } from '@material-ui/core';
import { useApi } from '../../../api/api-provider';

export const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>();
    const [loading, setLoading] = useState(false);
    const alert = useAlertMessage();
    const commonClasses = useCommonStyles();
    const history = useHistory();
    const theme = useTheme();
    const { Api } = useApi();

    useEffect(() => {
        setLoading(true);
        Api.Plan.getPlans()
            .then(({ data }) => setPlans(data))
            .catch(error  => alert.addMessage(error))
            .finally(() => setLoading(false));
    }, []);

    const onClickAddPlan: React.MouseEventHandler = () => {
        history.push('/plans/add')
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickEdit = () => {
        if (anchorEl) {
            const id = anchorEl.dataset.id;
            if(id) {
                history.push(`/plans/edit/${id}`);
            }
        }
        setAnchorEl(null);
    }


    return (
        <Box position="relative">
            <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                <Fab color="primary" title="Create a Plan" aria-label="add" onClick={onClickAddPlan}>
                    <AddIcon />
                </Fab>
            </Box>
            <TableContainer component={Paper} className={commonClasses.paper}>
                <Box mb={2}>
                    <Typography variant="h4">Plans</Typography>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Fuelings</TableCell>
                            <TableCell align="right">Meals</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            !loading && (plans && plans.length > 0 && plans.map(({ planId, name, fuelingCount, mealCount }) =>
                                <TableRow key={planId}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell align="right">{fuelingCount}</TableCell>
                                    <TableCell align="right">{mealCount}</TableCell>
                                    <TableCell width={1}>
                                        <IconButton aria-haspopup="true" onClick={handleClick} data-id={planId}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>))
                            ||
                            !loading && <TableRow>
                                <TableCell colSpan={4}>No plans have been created yet.</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
                {
                    loading && <Box><LinearProgress /></Box>
                }
            </TableContainer>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={onClickEdit}>Edit</MenuItem>
            </Menu>
        </Box>
    );
}