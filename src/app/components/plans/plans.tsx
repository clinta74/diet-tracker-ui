import { Box, Fab, IconButton, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Api } from '../../../api';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';

export const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>();
    const [loading, setLoading] = useState(false);
    const alert = useAlertMessage();
    const commonClasses = useCommonStyles();
    const history = useHistory();
    const theme = useTheme();

    useEffect(() => {
        setLoading(true);
        Api.Plan.getPlans()
            .then(({ data }) => setPlans(data))
            .catch((err: AxiosError) => {
                alert.addMessage(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const onClickAddPlan: React.MouseEventHandler = () => {
        history.push('/plans/add')
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
                                        <IconButton><MoreVertIcon /></IconButton>
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
                    loading && <Box><LinearProgress/></Box>
                }
            </TableContainer>
        </Box>
    );
}